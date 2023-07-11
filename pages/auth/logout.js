/* This may be better suited to be a modal which the user can interact with on any page */
import React from 'react'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'

export default function Logout() {
  return (
    <>
      <h1 className="display-4 text-center my-5">
        Are you sure you would like to Logout?
      </h1>
      <Row>
        <Button
          className="mx-auto my-5"
          style={{ width: '80%' }}
          variant="warning"
          type="submit"
          onClick={() => alert('sample environment, auth is unecessary')}
        >
          Logout
        </Button>
      </Row>
    </>
  )
}
