import { TamboProvider } from "@tambo-ai/react";
import { ChatInterface } from "./components/ChatInterface";
import { tamboComponents } from "./components/tambo";
import "./styles.css";

const TAMBO_API_KEY =
  "tambo_WbMsJaChSSrMMaq50EVkB58cgdJFFpDTQT79eiPsVtb8r0IrKHRs0Vzk61Ra4o4dwTCHiFSJP8FhN347TjAI88RrsJ2gBTH3RwDTWbYXq2A=";

export default function App() {
  return (
    <TamboProvider
      apiKey={TAMBO_API_KEY}
      userKey="local-user"
      components={tamboComponents}
    >
      <ChatInterface />
    </TamboProvider>
  );
}
