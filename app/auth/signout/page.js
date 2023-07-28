'use client'
import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react"
import { useState } from "react"
import { VscLoading } from 'react-icons/vsc'

export default function Logout() {
  const { data: session, status } = useSession()
  const [redirecting, setRedirecting] = useState()

  if (session === null && status !== 'loading') {
    signIn()
    return <h1 className="container text-4xl font-light text-center mt-52"><VscLoading className="inline mb-3 mr-5 animate-spin" size=".8em" />Redirecting</h1>
  }

  function handleSignout() {
    signOut({callbackUrl: '/auth/signin'})
    setRedirecting(true)
  }

  return (
      <div className="container grid p-5 w-full max-w-md items-center gap-1.5 mt-5">
        <h1 className="mb-5 font-light text-7xl">Sign out</h1>
        <h1 className="my-5 text-lg">Are you sure you would like to sign out of your account?</h1>
        <Button disabled={redirecting}  className="w-full mt-5" onClick={handleSignout}>
          {redirecting
            ? <><VscLoading className="h-4 mr-5 animate-spin" />Please Wait</>
            : "Sign out"
          }
        </Button>
      </div>
  )
}