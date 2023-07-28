'use client'
import { useState, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Skeleton } from './ui/skeleton'
// import { color_1, color_2 } from '@/constants'

ChartJS.register(ArcElement, Tooltip, Legend)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false
    },
    tooltip: {
      bodyFont: {
        size: 18
      },
      titleFont: {
        size: 18
      },
      padding: 4,
      callbacks: {
        label: function (context) {
          let total = 0
          context.dataset.data.forEach((amt) => {
            total += amt
          })
          const money = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          })
          return ` ${money.format(context.raw)} (${Math.round((context.raw / total) * 100)}%) `
        }
      }
    }
  }
}

export default function DoughnutChart({ data }) {
  const [clickedElement, setClickedElement] = useState('')
  const [chartData, setChartData] = useState()

  useEffect(() => {
    if (data) genChart()
  }, [data])

  if (!chartData) return (
    <Skeleton className="mx-auto rounded-full w-80 h-80" />
  )

  function genChart() {
    if (data.length == 0) return
    
    const labels = data.map(obj => obj.alias)
    const doughnutData = data.map(obj => obj.total)

    setChartData({
      labels: labels, 
      datasets: [
        {
          label: '% provided',
          data: doughnutData,
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(100, 51, 204, 0.2)',
            'rgba(180, 51, 204, 0.2)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(100, 51, 204, 1)',
            'rgba(180, 51, 204, 1)',
          ],
          borderWidth: 1,
        },
      ],
    })
  }

  return (
    <>
      <h1 className="mb-4 font-bold text-center">% Given</h1>
      <Doughnut data={chartData} options={options} style={{margin: 'auto'}} />
    </>
  )
}
