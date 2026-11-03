import type { ExtensionAPI } from "@earendil-works/pi-coding-agent"; // older installs: "@mariozechner/pi-coding-agent"
import { execSync } from "node:child_process";

const GIT_COMMIT = /\bgit\s+(?:-C\s+\S+\s+)?commit\b/;
// git commands that change the index before the commit runs
const GIT_STAGING = /\bgit\s+(?:-C\s+\S+\s+)?(?:add|rm|mv|restore|reset|stage)\b/;

function sh(cmd: string): string {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (e: any) {
    return (e.stdout ?? e.message ?? "").toString().trim();
  }
}

function extractMessage(cmd: string): string {
  // Collect every -m / --message argument ("..." or '...')
  const re = /(?:-m|--message)(?:\s+|=)(?:"((?:[^"\\]|\\.)*)"|'([^']*)')/g;
  const parts: string[] = [];
  for (const m of cmd.matchAll(re)) parts.push(m[1] ?? m[2]);
  if (parts.length) return parts.join("\n\n");
  if (/-F\s|--file[=\s]/.test(cmd)) return "(message read from a file: see the command)";
  return "(no -m: git would open an editor)";
}

export default function (pi: ExtensionAPI) {
  pi.on("tool_call", async (event, ctx) => {
    if (event.toolName !== "bash") return;
    const cmd = String((event.input as { command?: string }).command ?? "");
    if (!GIT_COMMIT.test(cmd)) return;

    // Staging + commit in a single call: the staged list would be stale at approval time
    if (GIT_STAGING.test(cmd)) {
      if (ctx.hasUI) ctx.ui.notify("Commit chained with staging: asking the agent to split it", "warning");
      return {
        block: true,
        reason:
          "Do not combine staging commands (git add/rm/mv/restore/reset) with git commit in the same bash call. " +
          "Run the staging command(s) first as a separate call, then run git commit on its own so the user can review the staged files.",
      };
    }

    // Without a UI (print/json mode), never commit silently
    if (!ctx.hasUI) return { block: true, reason: "git commit requires interactive user approval." };

    const all = /\s(-a|--all)\b/.test(cmd);
    const staged = sh(all ? "git status --short" : "git diff --cached --name-status") || "(nothing staged)";
    // Last line of --stat (summary), computed in JS so it also works on Windows (no `tail`)
    const stat = all ? "" : (sh("git diff --cached --stat").split("\n").pop() ?? "");

    const summary =
      `Command:\n  ${cmd}\n\n` +
      `${all ? "Files (commit -a)" : "Staged files"}:\n${staged}\n${stat}\n\n` +
      `Message:\n${extractMessage(cmd)}`;

    const choice = await ctx.ui.select(`Approve this commit?\n\n${summary}`, [
      "Proceed",
      "Modify (give instructions)",
      "Cancel",
    ]);

    if (choice === "Proceed") return; // let the command run

    if (choice === "Modify (give instructions)") {
      const feedback = await ctx.ui.input("What should change?", "e.g. drop foo.cs, shorter message…");
      return {
        block: true,
        reason:
          `The user did not approve the commit and asked for changes: "${feedback}". ` +
          `Apply them (adjust staging and/or message) and then run git commit again.`,
      };
    }

    return { block: true, reason: "The user cancelled the commit. Do not retry unless asked." };
  });
}