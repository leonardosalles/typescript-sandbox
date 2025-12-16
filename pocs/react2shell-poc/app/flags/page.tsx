
import { db } from "@/lib/db";
import { evaluateCondition } from "@/lib/executor";

export default async function FlagsPage() {
  const flags = db.flags.list();
  const ctx = { plan: "free" };

  return (
    <div>
      <h2>Feature Flags Evaluation</h2>
      <ul>
        {flags.map(flag => (
          <li key={flag.name}>
            {flag.name}: {String(evaluateCondition(flag.condition, ctx))}
          </li>
        ))}
      </ul>
    </div>
  );
}
