'use client'

import { signOut } from "next-auth/react";

export function Logout() { 
    return <div
    class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
    onClick={async () => {
        await signOut({
          redirect: true,
        });
      }}
  >
    <i class="bi bi-house-door-fill"></i>
    <span class="text-[15px] ml-4 text-gray-200 font-bold">Logout</span>
  </div>
}