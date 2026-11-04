import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent"; // older installs: "@mariozechner/pi-coding-agent"
import { execSync } from "node:child_process";

const G = String.raw`\bgit\s+(?:-C\s+\S+\s+)?`; // "git " or "git -C <path> "
const re = (s: string) => new RegExp(G + s);

const COMMIT = re(String.raw`commit\b`);
const STAGING = re(String.raw`(?:add|rm|mv|restore|reset|stage)\b`);
const BRANCH_OPS: [RegExp, string][] = [
  [re(String.raw`branch\s+(?:-[dDmMcCf]\b|--delete|--move|--copy|--force|[^-\s])`), "create/delete/rename branch"],
  [re(String.raw`(?:checkout|switch)\b.*\s(?:-[bBcC]|--create|--force-create|--orphan)\b`), "create branch"],
  [re(String.raw`(?:merge|rebase|cherry-pick|pull)\b(?!.*--(?:abort|quit))`), "merge/rebase/pull"],
  [re(String.raw`push\b.*(?:\s-d\b|--delete|\s:\S|\s-f\b|--force|\s\+\S)`), "delete remote branch / force-push"],
  [re(String.raw`reset\b.*--hard`), "hard reset"],
];

const sh = (cmd: string) => {
  try { return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim(); }
  catch { return ""; }
};

async function approve(ctx: ExtensionContext, question: string, summary: string, what: string) {
  const choice = await ctx.ui.select(`${question}\n\n${summary}`, ["Proceed", "Modify (give instructions)", "Cancel"]);
  if (choice === "Proceed") return undefined;
  if (choice === "Modify (give instructions)") {
    const fb = await ctx.ui.input("What should change?", "");
    if (fb) return { block: true, reason: `The user did not approve the ${what} and asked for changes: "${fb}". Apply them and try again.` };
  }
  return { block: true, reason: `The user cancelled the ${what}. Do not retry unless asked.` };
}

export default function (pi: ExtensionAPI) {
  pi.on("tool_call", async (event, ctx) => {
    if (event.toolName !== "bash") return;
    const cmd = String((event.input as { command?: string }).command ?? "");
    // Blank out quoted strings so text inside commit messages / echo doesn't match
    const bare = cmd.replace(/"(?:[^"\\]|\\.)*"|'[^']*'/g, '""');

    const isCommit = COMMIT.test(bare);
    const ops = BRANCH_OPS.filter(([r]) => r.test(bare)).map(([, label]) => label);
    if (!isCommit && !ops.length) return;
    if (!ctx.hasUI) return { block: true, reason: "This git operation requires interactive user approval." };

    if (isCommit && STAGING.test(bare)) {
      return {
        block: true,
        reason: "Don't chain staging (git add/rm/mv/restore/reset) with git commit. Stage in one bash call, then commit in a separate one.",
      };
    }

    const branch = sh("git branch --show-current") || "(detached HEAD)";

    if (ops.length) {
      const res = await approve(ctx, "Approve this branch operation?",
        `Command:\n  ${cmd}\n\nCurrent branch: ${branch}\nDetected: ${ops.join(", ")}`, "branch operation");
      if (res) return res;
    }

    if (isCommit) {
      const staged = sh("git diff --cached --name-status") || "(nothing staged)";
      const msg = [...cmd.matchAll(/(?:-m|--message)[\s=]+(?:"((?:[^"\\]|\\.)*)"|'([^']*)')/g)]
        .map((m) => m[1] ?? m[2]).join("\n\n") || "(no -m: see the command)";
      return approve(ctx, "Approve this commit?",
        `Command:\n  ${cmd}\n\nBranch: ${branch}\n\nStaged files:\n${staged}\n\nMessage:\n${msg}`, "commit");
    }
  });
}