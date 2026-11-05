import { type ExtensionAPI, isToolCallEventType } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
    pi.on("tool_call", async (event, ctx) => {
        const toolCommand = event.input.command;

        if (isToolCallEventType("bash", event)) {
            if (toolCommand.includes("git commit") || toolCommand.includes("git push")) {
                const choice = await ctx.ui.select(`About to perform command '${event.input.command}'`, ["Proceed", "Modify (give instructions)", "Cancel"]);

                if (choice === "Proceed") return undefined;

                if (choice === "Modify (give instructions)") {
                    const modifyInstructions = await ctx.ui.input("What should change?", "");
                    if (modifyInstructions) return { block: true, reason: `The user did not approve the command '${event.input.command}' and asked for the following changes: '${modifyInstructions}'. Apply them and try again.` };
                }

                return { cancel: true };
            }
        }
    });
}