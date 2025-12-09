import React from "react";
import { client, xml, Client } from "@xmpp/client";
import ChatWindow from "./ChatWindow";
import { useStore } from "./store";
import type { ChatMessage } from "protocol";

interface LoginResponse {
  jid: string;
  password: string;
  service: string;
}

const bareJid = (jid?: string) => jid?.split("/")[0] ?? "";

export default function App() {
  const [username, setUsername] = React.useState("leonardo");
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [me, setMe] = React.useState("");
  const [peer, setPeer] = React.useState("");
  const [status, setStatus] = React.useState("disconnected");

  const meRef = React.useRef("");
  const peerRef = React.useRef("");

  const xmppRef = React.useRef<Client | null>(null);
  const { add, update, clear } = useStore();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("logging in");

    try {
      const res = await fetch("http://localhost:3333/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!res.ok) throw new Error("login failed");

      const data = (await res.json()) as LoginResponse;

      const xmpp = client({
        service: data.service,
        domain: "localhost",
        username: data.jid.split("@")[0],
        password: data.password,
        resource: "web",
      });

      xmpp.on("offline", () => setStatus("offline"));
      xmpp.on("error", () => setStatus("error"));

      xmpp.on("online", async (addr) => {
        const myJid = bareJid(addr.toString());
        const other = username === "leonardo" ? "heitor" : "leonardo";
        const peerJid = bareJid(`${other}@localhost`);

        meRef.current = myJid;
        peerRef.current = peerJid;

        setMe(myJid);
        setPeer(peerJid);

        clear();
        setStatus("online");

        await xmpp.send(xml("presence"));
      });

      xmpp.on("stanza", (stanza) => {
        if (!stanza.is("message")) return;

        const from = bareJid(stanza.attrs.from as string | undefined);
        const stanzaId = stanza.attrs.id as string | undefined;

        const bodyEl = stanza.getChild("body");
        const received = stanza.getChild("received", "urn:xmpp:receipts");
        const displayed = stanza.getChild(
          "displayed",
          "urn:xmpp:chat-markers:0"
        );
        const request = stanza.getChild("request", "urn:xmpp:receipts");

        if (bodyEl && bodyEl.text() && from) {
          const msgId = stanzaId || crypto.randomUUID();

          const msg: ChatMessage = {
            id: msgId,
            from,
            to: meRef.current,
            body: bodyEl.text(),
            timestamp: Date.now(),
            status: "received",
          };

          add(msg);

          if (request) {
            xmpp.send(
              xml(
                "message",
                { to: from },
                xml("received", { xmlns: "urn:xmpp:receipts", id: msgId })
              )
            );
          }

          xmpp.send(
            xml(
              "message",
              { to: from },
              xml("displayed", {
                xmlns: "urn:xmpp:chat-markers:0",
                id: msgId,
              })
            )
          );

          return;
        }

        if (received) {
          const deliveredId = received.attrs.id as string | undefined;
          if (deliveredId) update(deliveredId, "received");
          return;
        }

        if (displayed) {
          const displayedId = displayed.attrs.id as string | undefined;
          if (displayedId) update(displayedId, "displayed");
        }
      });

      await xmpp.start();

      xmppRef.current = xmpp;
      setLoggedIn(true);
    } catch {
      setStatus("login error");
    }
  };

  const send = (text: string) => {
    if (!xmppRef.current || status !== "online") return;

    const id = crypto.randomUUID();

    const msg: ChatMessage = {
      id,
      from: meRef.current,
      to: peerRef.current,
      body: text,
      timestamp: Date.now(),
      status: "sent",
    };

    add(msg);

    xmppRef.current.send(
      xml(
        "message",
        { type: "chat", to: peerRef.current, id },
        xml("body", {}, text),
        xml("request", { xmlns: "urn:xmpp:receipts" })
      )
    );
  };

  const disconnect = async () => {
    await xmppRef.current?.stop();

    xmppRef.current = null;

    meRef.current = "";
    peerRef.current = "";

    setLoggedIn(false);
    setMe("");
    setPeer("");
    setStatus("disconnected");

    clear();
  };

  return (
    <div style={{ fontFamily: "system-ui,sans-serif", padding: 16 }}>
      <h1>xmpp-chat</h1>

      {!loggedIn ? (
        <form onSubmit={login} style={{ marginTop: 16 }}>
          <label>
            User:
            <select
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ marginLeft: 8 }}
            >
              <option value="leonardo">leonardo</option>
              <option value="heitor">heitor</option>
            </select>
          </label>

          <button type="submit" style={{ marginLeft: 8 }}>
            Sign in
          </button>

          <span style={{ marginLeft: 12, fontSize: 12 }}>Status: {status}</span>
        </form>
      ) : (
        <>
          <div style={{ marginTop: 8 }}>
            Signed in as <strong>{me}</strong>, chatting with{" "}
            <strong>{peer}</strong>
          </div>

          <button onClick={disconnect} style={{ marginTop: 8 }}>
            Disconnect
          </button>

          <div style={{ marginTop: 16, height: "60vh" }}>
            <ChatWindow me={me} peer={peer} onSend={send} />
          </div>
        </>
      )}
    </div>
  );
}
