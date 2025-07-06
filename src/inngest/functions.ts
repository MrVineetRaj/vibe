import { z } from "zod";
import { inngest } from "./client";
import {
  createAgent,
  createNetwork,
  createTool,
  openai,
} from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./uitls";
import { PROMPT } from "@/constants/prompt";

export const generateCode = inngest.createFunction(
  { id: "code-agent" },
  { event: "app/code.agent" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("vibe-sandbox-test-2");
      return sandbox.sandboxId;
    });

    // Create a new agent with a system prompt (you can add optional tools, too)
    // const result = await step.run("generating-code", async () => {
    const codeAgent = createAgent({
      name: "code-agent",
      description:
        "a senior software engineer working in a sandboxed Next.js 15.3.4 environment",
      system: PROMPT,
      model: openai({
        model: "gpt-4.1",
        defaultParameters: {
          temperature: 0.1,
        },
      }),
      tools: [
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            // return await step?.run("terminal", async () => {
            const buffers = { stdout: "", stderr: "" };
            try {
              const sandbox = await getSandbox(sandboxId);
              const result = await sandbox.commands.run(command, {
                onStdout: (data: string) => {
                  buffers.stdout += data;
                },
                onStderr: (data: string) => {
                  buffers.stderr += data;
                },
              });

              return result.stdout;
            } catch (err) {
              console.error(
                `Command failed: ${err} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`
              );
              return `Command failed: ${err} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`;
            }
            // });
          },
        }),
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
          handler: async ({ files }, { network }) => {
            // console.log("CMD is ", cmd);
            // const { step, network } = cmd;
            // const newFiles = await step?.run(
            //   "creating-or-updating-files",
            //   async () => {
            try {
              const updatedFiles = network.state.data.files || {};
              console.log("Running createOrUpdateFiles");
              const sandbox = await getSandbox(sandboxId);
              for (const file of files) {
                await sandbox.files.write(file.path, file.content);
                updatedFiles[file.path] = file.content;
              }
              // ADD THIS RETURN STATEMENT

              if (typeof updatedFiles === "object") {
                network.state.data.files = updatedFiles;
              }
              return updatedFiles;
            } catch (e) {
              return "Error" + e;
            }
            //   }
            // );
          },
        }),
        createTool({
          name: "readFiles",
          description: "Read files from sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            // return await step?.run("reading files", async () => {
            try {
              const sandbox = await getSandbox(sandboxId);
              console.log("Running readFiles");
              let contents = [];
              for (const file of files) {
                const content = await sandbox.files.read(file);
                contents.push({ path: file, content });
              }

              return JSON.stringify(contents);
            } catch (err) {
              return "Error: " + err;
            }
            // });
          },
        }),
      ],

      lifecycle: {
        onResponse: async ({ result, network }) => {
          console.log("Agent response received");
          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result);

          console.log(
            "Last message preview:",
            lastAssistantMessageText?.substring(0, 200)
          );

          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }
          return result;
        },
      },
    });

    console.log("CodeAgentCompleted");

    const network = createNetwork({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      router: async ({ network }) => {
        const summary = network.state.data.summary;

        if (summary) {
          console.log("Summary found, stopping network");
          return; // This stops the network
        }

        return codeAgent;
      },
    });

    console.log("Starting network with input:", event.data.value);

    const result = await step.run("run-network", async () => {
      return await network.run(event.data.value);
    });

    console.log("Network completed with result:", {
      hasFiles: !!result.state?.data?.files,
      hasSummary: !!result.state?.data?.summary,
    });
    // return result;
    // });

    const sandboxURL = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    return {
      url: sandboxURL,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
