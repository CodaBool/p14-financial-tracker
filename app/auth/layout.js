'use client'
// import Navigation from '@/components/Navigation'
import { Container } from 'react-bootstrap'

export default function layout({children}) {
  return (
    <>
      {/* <Navigation /> */}
      <Container>{children}</Container>
    </>
  )
}
