import { getServerSession } from "next-auth/next"
import { authOptions } from '../../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import Empty from "@/components/empty"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return redirect('/api/auth/signin')
  }

  const res = await fetch(process.env.NEXTAUTH_URL + "/api/data/completions/pending");
  const pendingReviews = await res.json();

  if (!pendingReviews || pendingReviews.length === 0) {
    return <Empty empty={{ description: "No pending reviews available"}} />
  }

  return (
      pendingReviews.map(review => review._id)
  )
}
