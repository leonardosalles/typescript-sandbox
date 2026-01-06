import Link from "next/link";
import DynamicComponent from "../components/DynamicComponent";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Turbopack POC
        </h1>
        <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          This is a proof of concept to demonstrate the capabilities of
          Turbopack compared to Webpack.
        </p>
        <DynamicComponent />
        <nav className="flex gap-4">
          <Link href="/page-one">Page One</Link>
          <Link href="/page-two">Page Two</Link>
        </nav>
      </main>
    </div>
  );
}
