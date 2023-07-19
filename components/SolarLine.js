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

export default function SolarLine({ datasets, labels }) {
  // let runningDate = new Date()
  // runningDate.setHours(0, 0, 0, 0)
  return (
    <Line 
      options={{
        labels: {
          font: {
            size: 14
          }
        },
        line: {
          fill: true
        },
        tooltip: {
          bodyFont: {
            size: 28
          },
          titleFont: {
            size: 28
          },
          padding: 4
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 30,
              },
            },
          },
          x: {
            ticks: {
              font: {
                size: 30,
              },
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
  )
}