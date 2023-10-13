import { getServerSession } from "next-auth/next"
import { authOptions } from '../../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return redirect('/api/auth/signin')
  }

  const res = await fetch(process.env.NEXTAUTH_URL + "/api/data/completions/pending");
  const pendingReviews = await res.json();

  return (
      <ul role="list" className="divide-y divide-gray-100">
        {pendingReviews.map((completion) => (
          <li key={completion.email} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={completion.imageUrl} alt="" />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">{completion.name}</p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{completion.email}</p>
              </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 text-gray-900">{completion.role}</p>
              {completion.lastSeen ? (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Last seen <time dateTime={completion.lastSeenDateTime}>{completion.lastSeen}</time>
                </p>
              ) : (
                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs leading-5 text-gray-500">Online</p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
  )
}
