'use client'
import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
import { Line } from 'react-chartjs-2'
import { VscLoading } from 'react-icons/vsc'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function Detail({ data }) {
  const categories = ['Water', 'Energy', 'Internet']
  const [datasets, setDataSets] = useState()
  const [year, setYear] = useState(new Date().getFullYear())
  const [labels, setLabels] = useState(Array.from({length: 12}, (_, i) => (i + 1)))
  const [options, setOptions] = useState([])

  useEffect(() =>  {
    if (data) getChartData()
  }, [data, year])

  if (!datasets) return <VscLoading className="mx-auto animate-spin" size="2em" />

  function getChartData() {
    const months = Array.from({length: 12}, (_, i) => (i + 1))

    if (window.screen.width > 800) {
      setLabels(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])
    }

    setDataSets(categories.map(label => {
      const tmp = months.map((month, i) => {
        let total = 0
        data.forEach(doc => {
          if (new Date(doc.date).getMonth() + 1 === i+1 && new Date(doc.date).getFullYear() === year) {
            if (doc.description.toLowerCase().includes(label.toLowerCase())) {
              total += doc.amount
            }
          }
        })
        if (total === 0) return null
        return total
      })
      let color = '132, 228, 109' // green
      if (label === 'Water') color = '14, 86, 231' // blue
      if (label === 'Energy') color = '231, 14, 14' // red
      return {
        label,
        borderColor: `rgb(${color})`,
        backgroundColor: `rgba(${color}, 0.2)`,
        data: tmp,
      }
    }))

    setOptions([...new Set(data.map(doc => {
      return new Date(doc.date).getFullYear()
    })).values()])
  }

  return (
    <>
      <div className="my-3 ms-3">
        <Select onValueChange={e => setYear(e)} >
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
      <Line 
        options={{
          scales: {
            y: {
              beginAtZero: true
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
