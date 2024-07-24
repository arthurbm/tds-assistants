"use client";

import { type StreamableValue, useStreamableValue } from "ai/rsc";
import ReactMarkdown from "react-markdown";

export function Message({ textStream }: { textStream: StreamableValue }) {
  const [text] = useStreamableValue(textStream);

  return (
    <div className="prose w-full max-w-full">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}
