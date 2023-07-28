'use client'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const orange = "249, 85, 46"
const yellow = "255, 189, 27"
const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] 

export default function SolarGraph({data}) {
  const [datasets, setDatasets] = useState()
  const [labels, setLabels] = useState()

  useEffect(() => {
    const solarData = []
    const usageData = []
    data.forEach((doc, i) => {
      solarData.push(doc.solar >= 0 ? doc.solar : 0)
      usageData.push(doc.usage)
    })
    setDatasets([
      {
        label: 'solar',
        fill: true,
        borderColor: `rgba(${yellow}, .8)`,
        backgroundColor: `rgba(${yellow}, .1)`,
        data: solarData,
        pointRadius: 0,
        borderWidth: 3,
      },
      {
        label: 'usage',
        fill: true,
        borderColor: `rgba(${orange}, .8)`,
        borderWidth: 2,
        backgroundColor: `rgba(${orange}, .1)`,
        data: usageData,
        pointRadius: 0,
      }
    ])
  }, [data])

  useEffect(() => {
    const firstTime = new Date()
    firstTime.setHours(0, 0, 0, 0)
    const tmpLabels = []
    for (let i = 0; i < 1440; i++) {
      if (i !== 0) {
        firstTime.setMinutes(firstTime.getMinutes() + 1)
      }
      const label = firstTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      tmpLabels.push(label)
    }
    setLabels(tmpLabels)
  }, [])

  if (!datasets?.length || !labels?.length) return null

  return (
    <>
      {/* <div className="my-3 ms-3">
        <Select onValueChange={e => console.log("set to", e)} >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={week[new Date().getDay()]} />
          </SelectTrigger>
          <SelectContent>
            {week.map((day, i) => (
              <SelectItem value={i} key={day}>{day}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}
      <Line 
        options={{
          // labels: {
          //   font: {
          //     size: 14
          //   }
          // },
          line: {
            fill: true
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                // font: {
                //   size: 30,
                // },
              },
            },
            x: {
              ticks: {
                // font: {
                //   size: 30,
                // },
                // callback: (value, index) => {
                //   if (value !== 0) {
                //     runningDate.setMinutes(runningDate.getMinutes() + 1)
                //   }
                //   return index % 60 === 1 ? '' : runningDate.toLocaleTimeString([], { hour: "numeric" })
                // },
              },
            }
          },
          datasets: {
            line: {
              borderWidth: 8,
              tension: .3
            }
          }
        }}
        data={{
          labels,
          datasets
        }} 
      />
    </>
  )
}
