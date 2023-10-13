import { getServerSession } from "next-auth/next"
import { authOptions } from '../../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import Empty from "@/components/empty"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return redirect('/api/auth/signin')
  }

  const res = await fetch(process.env.NEXTAUTH_URL + "/api/data/completions/rejected");
  const rejectedCompletions = await res.json();

  if (!rejectedCompletions || rejectedCompletions.length === 0) {
    return <Empty empty={{description: "No completions were rejected yet"}} />
  }

  return (
    <main>
      {rejectedCompletions.map(review => {
        return (
          <div key={review._id}>
            <h1>question</h1>
            <p>answer</p>
          </div>
        )
      })}
    </main>
  )
}
