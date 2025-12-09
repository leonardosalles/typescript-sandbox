import React from "react";
import { useStore } from "./store";

export default function ChatWindow({
  me,
  peer,
  onSend,
  onTyping,
  typing,
  presence,
}: {
  me: string;
  peer: string;
  onSend: (t: string) => void;
  onTyping: () => void;
  typing: boolean;
  presence?: string;
}) {
  const { messages } = useStore();
  const [text, setText] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  const filtered = messages.filter(
    (m) => (m.from === me && m.to === peer) || (m.from === peer && m.to === me)
  );

  const presenceLabel =
    presence === "chat" || presence === "online"
      ? "online"
      : presence || "offline";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        border: "1px solid #ddd",
        borderRadius: 8,
      }}
    >
      <div
        style={{
          padding: 8,
          borderBottom: "1px solid #eee",
          fontWeight: "bold",
        }}
      >
        Chat with {peer}
        <div
          style={{
            fontSize: 12,
            color: presenceLabel === "online" ? "green" : "#666",
            marginTop: 2,
          }}
        >
          {presenceLabel}
        </div>
        {typing && (
          <div style={{ fontSize: 12, fontStyle: "italic", color: "#888" }}>
            {peer} is typing...
          </div>
        )}
      </div>

      <div
        style={{
          flex: 1,
          padding: 8,
          overflowY: "auto",
          background: "#fafafa",
        }}
      >
        {filtered.map((m) => {
          const mine = m.from === me;

          return (
            <div
              key={m.id}
              style={{
                display: "flex",
                justifyContent: mine ? "flex-end" : "flex-start",
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "6px 10px",
                  borderRadius: 12,
                  background: mine ? "#d1f1ff" : "#fff",
                  border: "1px solid #ddd",
                  fontSize: 14,
                }}
              >
                <div>{m.body}</div>
                <div
                  style={{
                    fontSize: 10,
                    marginTop: 2,
                    textAlign: "right",
                    opacity: 0.7,
                  }}
                >
                  {m.status === "sent" && "✓"}
                  {m.status === "received" && "✓✓"}
                  {m.status === "displayed" && "✓✓ read"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", padding: 8, borderTop: "1px solid #eee" }}
      >
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onTyping();
          }}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
            marginRight: 8,
          }}
        />

        <button type="submit" style={{ padding: "8px 16px" }}>
          Send
        </button>
      </form>
    </div>
  );
}
