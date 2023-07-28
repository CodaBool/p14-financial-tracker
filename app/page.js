import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { authOptions } from './api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import dbConnect, { jparse } from '@/lib/db'
import aggregate from '@/lib/aggregate'
import { Daily } from '@/lib/models'
import { redirect } from 'next/navigation'
import Bars from '@/components/Bars'
import DoughnutChart from '@/components/Doughnut'
import Solar from '@/components/Solar'
import Bills from '@/components/Bills'
import History from '@/components/History'

export default async function Main() {

  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/signin?callbackUrl=/")
  await dbConnect()
  // const admin = session?.user.email === 'codabool@pm.me'
  const aggRaw = await aggregate()
  const jsDay = new Date().getDay()
  const pythonDay = (jsDay + 6) % 7
  // console.log("search for day", pythonDay, jsDay, new Date())
  const solarRaw = await Daily.find({ day: pythonDay }).sort({ createdAt: 1 })
  // console.log("date", solarRaw[0].createdAt)
  const agg = jparse(aggRaw[0])
  const solar = jparse(solarRaw)

  return (
    <div className="container my-16">
      <div className="flex flex-wrap">
        <div className="w-full mt-4 lg:w-2/3">
          <Bars data={agg.bar} screen="small" />
        </div>
        <div className="w-full my-5 lg:w-1/3 doughnut-container">
          <DoughnutChart data={agg.doughnut} />
        </div>
      </div>
      <div className="h-screen mt-8">
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="">
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="bills">Bills</TabsTrigger>
            <TabsTrigger value="solar">Solar</TabsTrigger>
          </TabsList>
          <TabsContent value="history">
            <History originalData={agg.raw} />
          </TabsContent>
          <TabsContent value="bills">
            <Bills data={agg.raw} screen="small" />
          </TabsContent>
          <TabsContent value="solar">
            <Solar data={solar} screen="small" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
