'use client'

import { signOut } from "next-auth/react";

export function Logout() { 
    return <button onClick={async () => await signOut({ redirect: true })} className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-700">
    Logout
  </button>
}