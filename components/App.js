'use client'
import { Col, Row, Tabs, Tab, Container } from 'react-bootstrap'
import Doughnut from '@/components/Doughnut'
import Bars from '@/components/Bars'
import History from '@/components/History'
import Detail from '@/components/Detail'
import { useState } from 'react'
import useScreen from '@/constants/useScreen'
import Graph from './Graph'

export default function FrontEnd({solar, agg, admin}) {
  const [key, setKey] = useState('history')
  let screen = useScreen()
  if (!screen) screen = 'medium'

  return (
    <Container style={{marginBottom: '10em'}}>
      <Row>
        <Col lg={8}>
          <div className='mt-4'>
            <Bars data={agg.bar} screen={screen} />
          </div>
        </Col>
        <Col lg={4}>
          <div className={'my-5 doughnut-container'}>
            <Doughnut data={agg.doughnut} />
          </div>
        </Col>
      </Row>
      <Tabs
        id="tab"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mt-2"
      >
        <Tab eventKey="history" title="History">
          <History data={agg} admin={admin} />
        </Tab>
        <Tab eventKey="detail" title="Detail">
          <Detail data={agg} screen={screen} />
        </Tab>
        <Tab eventKey="solar" title="Solar">
          <Graph data={solar} screen={screen} />
        </Tab>
      </Tabs>
    </Container>
  )
}
