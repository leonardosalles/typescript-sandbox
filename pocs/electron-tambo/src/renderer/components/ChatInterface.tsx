import { useTambo, useTamboThreadInput } from "@tambo-ai/react";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export function ChatInterface() {
  const { messages, isStreaming } = useTambo();
  const { value, setValue, submit, isPending } = useTamboThreadInput();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="chat-root">
      <header className="chat-header">
        <div className="chat-header-dot" />
        <span className="chat-header-title">System Assistant</span>
        {isStreaming && <span className="chat-streaming-badge">thinking…</span>}
      </header>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p className="chat-empty-title">What can I do for you?</p>
            <div className="chat-suggestions">
              {[
                "Set volume to 40%",
                "Show system info",
                "Send me a reminder notification",
                "Open https://tambo.co",
              ].map((s) => (
                <button
                  key={s}
                  className="suggestion-chip"
                  onClick={() => {
                    setValue(s);
                    setTimeout(() => submit(), 50);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === "user";
          const contentBlocks = Array.isArray(msg.content) ? msg.content : [];

          return (
            <div
              key={msg.id}
              className={`chat-message ${isUser ? "chat-message--user" : "chat-message--assistant"}`}
            >
              {contentBlocks.map((block: any, i: number) => {
                if (block.type === "text" && block.text?.trim()) {
                  return (
                    <div key={i} className="chat-bubble">
                      <ReactMarkdown>{block.text}</ReactMarkdown>
                    </div>
                  );
                }
                if (block.type === "component" && block.renderedComponent) {
                  return (
                    <div key={i} className="chat-component">
                      {block.renderedComponent}
                    </div>
                  );
                }
                return null;
              })}

              {typeof msg.content === "string" && msg.content.trim() && (
                <div className="chat-bubble">
                  {isUser ? (
                    msg.content
                  ) : (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {isPending && (
          <div className="chat-message chat-message--assistant">
            <div className="chat-bubble chat-bubble--loading">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          className="chat-input"
          placeholder="Ask me to control your system… (Enter to send)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isPending}
        />
        <button
          className="chat-send-btn"
          onClick={() => submit()}
          disabled={isPending || !value.trim()}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
