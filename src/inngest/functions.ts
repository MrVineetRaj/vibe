import { inngest } from "./client";
import { createAgent, openai } from "@inngest/agent-kit";

// export const helloWorld = inngest.createFunction(
//   { id: "hello-world" },
//   { event: "test/hello.world" },
//   async ({ event, step }) => {
//     const sandboxId = await step.run("get-sandbox-id", async () => {
//       const sandbox = await Sandbox.create("vibe-sandbox-test-2");
//       return sandbox.sandboxId;
//     });

//     // Create a new agent with a system prompt (you can add optional tools, too)
//     const output = await step.run("generating-code", async () => {
//       const writer = createAgent({
//         name: "writer",
//         system:
//           "You are an expert next.js developer.  You write readable, maintainable code, simple. You write simple Next.js and React Snippets",
//         model: openai({ model: "gpt-4o" }),
//         tools: [
//           createTool({
//             name: "terminal",
//             description: "Use the terminal to run commands",
//             parameters: z.object({
//               command: z.string(),
//             }),
//             handler: async ({ command }, { step }) => {
//               return await step?.run("terminal", async () => {
//                 const buffers = { stdout: "", stderr: "" };

//                 try {
//                   const sandbox = await getSandbox(sandboxId);
//                   const result = await sandbox.commands.run(command, {
//                     onStdout: (data: string) => {
//                       buffers.stdout += data;
//                     },
//                     onStderr: (data: string) => {
//                       buffers.stderr += data;
//                     },
//                   });

//                   return result.stdout;
//                 } catch (err) {
//                   console.error(
//                     `Command failed: ${err} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`
//                   );
//                   return `Command failed: ${err} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`;
//                 }
//               });
//             },
//           }),
//           createTool({
//             name:"createOrUpdateFiles",
//             description:"Create or update fil"
//             handler:()=>{}
//           })
//         ],
//       });

//       console.log("Output generate !");
//       // Run the agent with an input.  This automatically uses steps
//       // to call your AI model.

//       const { output } = await writer.run(
//         `Write a tweet on ${event.data.value}`
//       );

//       return output;
//     });
//     const sandboxURL = await step.run("get-sandbox-url", async () => {
//       const sandbox = await getSandbox(sandboxId);
//       const host = sandbox.getHost(3000);
//       return `https://${host}`;
//     });

//     return { output, sandboxURL };
//   }
// );
// export const runSandBox = inngest.createFunction(
//   { id: "run-sandbox" },
//   { event: "app/run.sandbox" },
//   async ({ event, step }) => {
//     const sandboxId = await step.run("get-sandbox-id", async () => {
//       const sandbox = await Sandbox.create("vibe-sandbox-test-2");
//       return sandbox.sandboxId;
//     });

//     const sandboxURL = step.run("get-sandbox-url", async () => {
//       const sandbox = await getSandbox(sandboxId);
//       const host = sandbox.getHost(3000);
//       return `https://${host}`;
//     });

//     return { sandboxURL };
//   }
// );

export const generateCode = inngest.createFunction(
  { id: "generate-code" },
  { event: "app/generate.code" },
  async ({ event, step }) => {
    const codeGenerator = createAgent({
      name: "CodeAgent",
      system:
        "You are an expert next.js developer.  You write readable, maintainable code, simple. You write simple Next.js and React Snippets",
      model: openai({ model: "gpt-4o" }),
    });

    console.log(event.data.value);
    const output = await step.run("Generating code", async () => {
      const { output } = await codeGenerator.run(`${event.data.value}`);

      return output;
    });

    return { output };
  }
);
