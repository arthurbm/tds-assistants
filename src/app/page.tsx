"use client";
import React, { useState } from "react";
import { useActions } from "ai/rsc";
import { type ClientMessage } from "./actions";
import { generateId } from "ai";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const { submitMessage } = useActions();

  const handleSubmission = async () => {
    if (!input.trim()) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: generateId(),
        status: "user.message.created",
        text: input,
        gui: null,
      },
    ]);

    const response = await submitMessage(input);
    setMessages((currentMessages) => [...currentMessages, response]);
    setInput("");
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex items-center justify-between px-8 py-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>CG</AvatarFallback>
            </Avatar>
            <h1 className="text-lg font-medium">Blog infinito v2</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <SettingsIcon className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
            <Button variant="ghost" size="icon">
              <HandHelpingIcon className="h-5 w-5" />
              <span className="sr-only">Help</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <div className="container px-8 py-8">
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="flex w-full items-start gap-4">
                <Avatar className="h-8 w-8 flex-shrink-0 border">
                  <AvatarImage src="/placeholder-user.jpg" />
                  {/* <AvatarFallback>
                    {message.status === "user.message.created" ? "YO" : "CG"}
                  </AvatarFallback> */}
                </Avatar>
                {message.text}
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer className="sticky bottom-0 border-t bg-background">
        <div className="container flex items-center gap-2 px-8 py-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[48px] flex-1 resize-none rounded-2xl border border-neutral-400 p-3 pr-16 shadow-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSubmission();
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="h-8 w-8"
            disabled={!input.trim()}
            onClick={handleSubmission}
          >
            <SendIcon className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </footer>
    </div>
  );
}

function HandHelpingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14" />
      <path d="m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
      <path d="m2 13 6 6" />
    </svg>
  );
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
