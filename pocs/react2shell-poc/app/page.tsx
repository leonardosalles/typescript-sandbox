
import Link from "next/link";

export default function Home() {
  return (
    <ul>
      <li><Link href="/pipelines/1">Pipeline Transformer</Link></li>
      <li><Link href="/flags">Feature Flags</Link></li>
    </ul>
  );
}
