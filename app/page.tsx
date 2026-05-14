import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xl text-6xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Trader's Gate
          </h1>
          <Link href="/dashboard" className="bg-black text-white rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Go to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
