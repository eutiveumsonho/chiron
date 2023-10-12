import Link from "next/link";

export function Tabs() {
    return <div className="h-20 rounded-lg border border-zinc-200 border-dashed dark:border-zinc-800">
    <div className="flex justify-between px-4 md:px-6 lg:px-8">
    <Link className="flex items-center gap-2 font-semibold" href="/completions/pending">
      <button className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-700">
        Pending Review
      </button>
      </Link>
      <Link className="flex items-center gap-2 font-semibold" href="/completions/approved">
      <button className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-700">
        Approved
      </button>
      </Link>
      <Link className="flex items-center gap-2 font-semibold" href="/completions/rejected">
      <button className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-700">
        Rejected
      </button>
      </Link>
    </div>
  </div>
}