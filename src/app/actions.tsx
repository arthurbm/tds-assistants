"use server";

import { generateId } from "ai";
import { createAI, createStreamableUI, createStreamableValue } from "ai/rsc";
import { OpenAI } from "openai";
import { type ReactNode } from "react";
import { Message } from "./message";

function extractSource(annotation: string): string {
  const pattern = /【(\d+):(\d+)†/;
  const match = annotation.match(pattern);

  if (match) {
    const chapter = match[1];
    const verse = match[2];
    return `[${chapter}:${verse}]`;
  }

  return "Invalid annotation format";
}

function removeFileExtensionAndAddLink(filename: string): string {
  const backUrl = filename.replace(/\.[^/.]+$/, "").split("__")[1];

  return `https://silvio.meira.com/${backUrl}`;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ClientMessage {
  id: string;
  text: ReactNode;
}

interface Source {
  file_id: string;
  text: string;
}

const ASSISTANT_ID = "asst_5T64k8AI4YD486uBCbujkKnG";
let THREAD_ID = "";
let RUN_ID = "";

export async function submitMessage(question: string): Promise<ClientMessage> {
  const textStream = createStreamableValue("");
  const textUIStream = createStreamableUI(
    <Message textStream={textStream.value} />
  );

  const runQueue = [];
  const sourceMap = new Map<string, Source>();

  void (async () => {
    if (THREAD_ID) {
      await openai.beta.threads.messages.create(THREAD_ID, {
        role: "user",
        content: question,
      });

      const run = await openai.beta.threads.runs.create(THREAD_ID, {
        assistant_id: ASSISTANT_ID,
        stream: true,
      });

      runQueue.push({ id: generateId(), run });
    } else {
      const run = await openai.beta.threads.createAndRun({
        assistant_id: ASSISTANT_ID,
        stream: true,
        thread: {
          messages: [{ role: "user", content: question }],
        },
      });

      runQueue.push({ id: generateId(), run });
    }

    while (runQueue.length > 0) {
      const latestRun = runQueue.shift();

      if (latestRun) {
        for await (const delta of latestRun.run) {
          const { data, event } = delta;

          if (event === "thread.created") {
            THREAD_ID = data.id;
          } else if (event === "thread.run.created") {
            RUN_ID = data.id;
          } else if (event === "thread.message.delta") {
            data.delta.content?.map((part) => {
              if (part.type === "text" && part.text) {
                if (part.text.annotations && part.text.annotations.length > 0) {
                  part.text.annotations.map((annotation) => {
                    const source = extractSource(annotation.text!);
                    textStream.append(source ?? "");

                    // Only add the source if it's not already in the map
                    if (!sourceMap.has(source)) {
                      sourceMap.set(source, {
                        // @ts-ignore
                        file_id: annotation.file_citation.file_id,
                        text: source,
                      });
                    }
                  });
                } else {
                  textStream.append(part.text.value!);
                }
              }
            });
          } else if (event === "thread.run.failed") {
            console.error(data);
          }
        }
      }
    }

    // Append unique sources at the end
    // if (sourceMap.size > 0) {
    //   await Promise.all(
    //     Array.from(sourceMap.values()).map(async (source) => {
    //       const response = await openai.files.retrieve(source.file_id);
    //       textStream.append(
    //         `\n\n${source.text}:  ${removeFileExtensionAndAddLink(response.filename)}`,
    //       );
    //     }),
    //   );
    // }

    textStream.done();
  })();

  return {
    id: generateId(),
    text: textUIStream.value,
  };
}

export const AI = createAI({
  actions: {
    submitMessage,
  },
});
