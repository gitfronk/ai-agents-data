/**
 * Plan Mode extension for Pi
 *
 * Read-only mode: the agent can explore the codebase and describe the changes
 * it WOULD make, but it cannot write/edit files or run bash commands.
 *
 * Usage:
 *   /plan            toggle plan mode
 *   Ctrl+Shift+P     toggle plan mode
 *   pi --plan        start in plan mode
 *
 * Install (global):   ~/.pi/agent/extensions/plan-mode.ts
 * Install (project):  .pi/extensions/plan-mode.ts
 * Quick test:         pi -e ./plan-mode.ts
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
// If you're on an older Pi version, use "@mariozechner/pi-coding-agent" instead.

// Tools that can read/explore only. No write, edit or bash.
const PLAN_TOOLS = ["read", "grep", "find", "ls"];

// Tools that are always blocked while in plan mode (defense in depth:
// even if another extension re-enables them, the tool_call hook stops them).
const BLOCKED_TOOLS = new Set(["write", "edit", "bash"]);

const PLAN_PROMPT = `

[PLAN MODE ACTIVE]
You are in plan mode. You can only read and explore the codebase (read, grep, find, ls).
You CANNOT create, modify or delete files, and you CANNOT run shell commands.
Do NOT attempt to call write, edit or bash: they will be blocked.

Your job is to PREVIEW the changes, not apply them. Respond with:
1. A short summary of what you understood and what you found in the code.
2. A numbered plan of the steps you would take.
3. For each step: the file path and a preview of the change (a fenced diff or code block).
4. Risks, open questions, and anything you could not verify.

Make clear these are proposals only. Nothing has been applied.`;

export default function planMode(pi: ExtensionAPI) {
  let enabled = false;
  let previousTools: string[] | null = null;

  pi.registerFlag("plan", {
    description: "Start in plan mode (read-only, previews changes only)",
    type: "boolean",
    default: false,
  });

  function enable(ctx: any) {
    if (enabled) return;
    enabled = true;
    previousTools = pi.getActiveTools();
    // Only keep read-only tools that actually exist in this session.
    const available = new Set(pi.getAllTools().map((t: any) => t.name));
    const tools = PLAN_TOOLS.filter((t) => available.has(t));
    pi.setActiveTools(tools);
    ctx.ui?.setStatus?.("plan-mode", "⏸ plan");
    ctx.ui?.notify?.("Plan mode ON: read-only, changes are previewed but never applied.", "info");
  }

  function disable(ctx: any) {
    if (!enabled) return;
    enabled = false;
    if (previousTools) pi.setActiveTools(previousTools);
    previousTools = null;
    ctx.ui?.setStatus?.("plan-mode", undefined);
    ctx.ui?.notify?.("Plan mode OFF: full tool access restored.", "info");
  }

  function toggle(ctx: any) {
    enabled ? disable(ctx) : enable(ctx);
  }

  pi.registerCommand("plan", {
    description: "Toggle plan mode (read-only, preview changes only)",
    handler: async (_args, ctx) => {
      toggle(ctx);
    },
  });

  pi.registerShortcut("ctrl+shift+p", {
    description: "Toggle plan mode",
    handler: async (ctx) => {
      toggle(ctx);
    },
  });

  // Start in plan mode if launched with --plan
  pi.on("session_start", async (_event, ctx) => {
    if (pi.getFlag("plan")) enable(ctx);
  });

  // Tell the model what it can and cannot do
  pi.on("before_agent_start", async (event) => {
    if (!enabled) return;
    return { systemPrompt: event.systemPrompt + PLAN_PROMPT };
  });

  // Hard enforcement: block mutating tools no matter what.
  pi.on("tool_call", async (event) => {
    if (!enabled) return;
    if (BLOCKED_TOOLS.has(event.toolName)) {
      return {
        block: true,
        reason:
          `Plan mode is active: "${event.toolName}" is disabled. ` +
          `Describe the change as a preview in your answer instead. ` +
          `The user can run /plan to leave plan mode.`,
      };
    }
  });
}
