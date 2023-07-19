import { getServerSession } from "next-auth"
import options from "@/util/auth"
import { redirect } from 'next/navigation'
import { Daily } from '@/models'
import dbConnect, { jparse } from '@/util/db'
import aggregate from '@/util/aggregate'
import App from '@/components/App'

export default async function Index() {
  const session = await getServerSession(options)
  if (!session) redirect("/auth/login?callbackUrl=/")
  await dbConnect()
  const admin = session?.user.email === 'codabool@pm.me'
  const aggRaw = await aggregate()
  const day = (new Date().getDay() + 6) % 7
  console.log("search for day", day, new Date())
  const solarRaw = await Daily.find({ day }).sort({ createdAt: 1 })
  const agg = jparse(aggRaw)
  const solar = jparse(solarRaw)
  
  return (
    <>
      <App solar={solar} agg={agg[0]} admin={admin} />
    </>
  )
}