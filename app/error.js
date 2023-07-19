'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
import { signIn } from "next-auth/react"
 
export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error)
    if (error.message === "unauthorized") {
      signIn()
    }
  }, [error])
 
  return (
    <div>
      <h2>{error?.message}</h2>
    </div>
  )
}