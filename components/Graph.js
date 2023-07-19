'use client'

import { useEffect, useState } from "react"
// import Form from 'react-bootstrap/Form'
import SolarLine from '@/components/SolarLine'

const orange = "249, 85, 46"
const yellow = "255, 189, 27"

export default function Graph({data}) {
  const [datasets, setDatasets] = useState()
  const [labels, setLabels] = useState()

  useEffect(() => {
    const solarData = []
    const usageData = []
    data.forEach((doc, i) => {
      solarData.push(doc.solar)
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
  

  
  // categories.forEach(category => {
  //   const monthlyData = months.map(month => {
  //     let total = 0
  //     d.forEach(row => {
  //       console.log('row', row)
  //       // if (new Date(doc.createdAt).getMonth() + 1 === month && new Date(doc.createdAt).getFullYear() === year) {
  //       //   if (doc.description.toLowerCase().includes(category.toLowerCase())) {
  //       //     total += doc.amount
  //       //   }
  //       // }
  //     })
  //     if (total === 0) return null
  //     return total
  //   })
  //   let color = [132, 228, 109] // green
  //   // if (category === 'Water') color = [ 14, 86, 231 ] // blue
  //   // if (category === 'Energy') color = [ 231, 14, 14 ] // red
  //   tmp.push({
  //     label: category,
  //     borderColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
  //     backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.2)`,
  //     data: monthlyData,
  //   })
  // })

  // const [datasets, setDataSets] = useState(tmp)
  // const [year, setYear] = useState(new Date().getFullYear())
  // const [yearOptions, setYearOptions] = useState([...new Set(d.map(doc => {
  //   return new Date(doc.createdAt).getFullYear()
  // })).values()])
  // const yearSelect = useRef(null)

  // useEffect(() => {
  //   if (yearSelect) {
  //     if (yearSelect.current) {
  //       yearSelect.current.value = year
  //     }
  //   }
  // }, [yearOptions, year])

  // const months = Array.from({length: 12}, (v, i) => (i + 1))

  // if (true) labels = months
  // if (!screen.includes('small')) labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  function handleYear(e) {
    if (Number(e.target.value) !== year) {
      setYear(Number(e.target.value))
    }
  }

  // console.log(data)
  if (!datasets?.length || !labels?.length) return null

  return (
    <>
      {/* <Form.Select className="pt-2 d-inline" style={{maxWidth: '120px'}} onChange={handleYear} ref={yearSelect}>
        {yearOptions.length > 0 && yearOptions.map(y => (
          <option value={y} key={y}>{y}</option>
        ))}
      </Form.Select> */}
      <SolarLine labels={labels} datasets={datasets} />
    </>
  )
}
