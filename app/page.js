import { getServerSession } from "next-auth/next"
import { authOptions } from './api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { Logout } from "@/components/logout";

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return redirect('/api/auth/signin')
  }

  return (
    <main>
      <span
        class="absolute text-white text-4xl top-5 left-4 cursor-pointer"
      >
        <i class="bi bi-filter-left px-2 bg-gray-900 rounded-md"></i>
      </span>
      <div
        class="sidebar fixed top-0 bottom-0 lg:left-0 p-2 w-[300px] overflow-y-auto text-center bg-gray-900"
      >
        <div class="text-gray-100 text-xl">
          <div class="p-2.5 mt-1 flex items-center">
            <i class="bi bi-app-indicator px-2 py-1 rounded-md bg-blue-600"></i>
            <h1 class="font-bold text-gray-200 text-[15px] ml-3">HITL</h1>
            <i
              class="bi bi-x cursor-pointer ml-28 lg:hidden"
            ></i>
          </div>
          <div class="my-2 bg-gray-600 h-[1px]"></div>
        </div>
        <div
          class="p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-gray-700 text-white"
        >
          <i class="bi bi-search text-sm"></i>
          <input
            type="text"
            placeholder="Search"
            class="text-[15px] ml-4 w-full bg-transparent focus:outline-none"
          />
        </div>
        <div
          class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
        >
          <i class="bi bi-house-door-fill"></i>
          <span class="text-[15px] ml-4 text-gray-200 font-bold">Home</span>
        </div>
        <Logout />
      </div>
    </main>
  )
}
