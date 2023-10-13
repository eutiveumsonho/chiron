import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
import Dashboard from '@/components/dashboard';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

export const metadata = {
  title: 'Human-in-the-loop',
  description: 'Generated by create next app',
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)
  
  return (
    <html lang="en">
      <body className={inter.className}><Dashboard serverSession={session}>{children}</Dashboard></body>
    </html>
  )
}
