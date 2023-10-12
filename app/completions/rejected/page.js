import { getServerSession } from "next-auth/next"
import { authOptions } from '../../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return redirect('/api/auth/signin')
  }

  const res = await fetch(process.env.NEXTAUTH_URL + "/api/data/completions/rejected");
  const rejectedCompletions = await res.json();

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
