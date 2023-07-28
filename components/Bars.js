'use client'
import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bar } from 'react-chartjs-2'
import { Skeleton } from './ui/skeleton'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function Bars({ data }) {
  const [datasets, setDatasets] = useState()
  const [labels, setLabels] = useState(Array.from({length: 12}, (_, i) => (i + 1)))
  const [year, setYear] = useState(new Date().getFullYear())
  const [options, setOptions] = useState([])

  useEffect(() => {
    if (data) genChart()
  }, [data, year])

  if (!datasets) return (
    <Skeleton className="w-full h-96 p-9" />
  )

  function genChart() {
    if (data.length == 0) return
    const aliases = [...new Set(data.map(e => e.alias))]

    const barData = aliases.map(alias => (
      labels.map((month, i) => {
        let total = 0
        data.forEach(doc => {
          if (doc.alias === alias && doc.month === i+1 && doc.year === year) total = doc.total
        })
        return total
      })
    ))

    setDatasets(aliases.map((alias, index) => {
      let backgroundColor = 'rgba(54, 162, 235, .8)'
      if (alias == 'AJ' || alias == 'Other') backgroundColor = 'rgba(100, 51, 204, .8)'
      return {
        type: 'bar',
        label: aliases[index],
        backgroundColor,
        data: barData[index],
      }
    }) || [])

    if (window.screen.width > 800) {
      setLabels(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])
    }

    setOptions([...new Set(data.map(({ year }) => year)).values()])
  }

  return (
    <>
      <div className="flex items-center mb-4">
        <h4 className="mx-8 font-bold">Year View</h4>
        <div className="mr-8 ms-auto">
          <Select onValueChange={e => setYear(e)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={year} />
            </SelectTrigger>
            <SelectContent>
              {options.map(year => (
                <SelectItem value={year} key={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Bar data={{ labels, datasets }} />
    </>
  )
}