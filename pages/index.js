import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import useSWR from 'swr'

import { isLoad, Load } from '../components/Load'
import Doughnut from '../components/Doughnut'
import Bars from '../components/Bars'
import History from '../components/History'
import Detail from '../components/Detail'
import useScreen from '../constants/useScreen'
import data from '../constants/sample-data.json'

export default function index() {
  const [key, setKey] = useState('history')
  let screen = useScreen()
  if (!screen) screen = 'medium'

  return (
    <>
      <Row>
        <Col lg={8}>
          <div className={`${!screen.includes('small') && 'p-5'} mt-3`}>
            {data && <Bars data={data.bar} screen={screen} />}
          </div>
        </Col>
        <Col lg={4}>
          <div className={`${screen.includes('small') ? 'mt-5' : 'p-3'} mb-5 doughnut-container`}>
            {data && <Doughnut data={data.doughnut} />}
          </div>
        </Col>
      </Row>
      <>
        <Tabs
          id="tab"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mt-2"
        >
          <Tab eventKey="history" title="History">
            <History data={data} />
          </Tab>
          <Tab eventKey="detail" title="Detail">
            <Detail data={data} screen={screen} />
          </Tab>
        </Tabs>
      </>
    </>
  )
}
