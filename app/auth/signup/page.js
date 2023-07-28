'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IoIosMail, IoIosKey, IoIosPerson, IoMdHappy } from 'react-icons/io'
import { VscLoading } from 'react-icons/vsc'
import { useRouter, useSearchParams } from 'next/navigation'
import { Controller, useForm } from "react-hook-form"
import { useState } from "react"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function Home() {
  const { handleSubmit, formState: { errors }, control } = useForm()
  const { toast } = useToast()
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")
  const router = useRouter()
  const [submitting, setSubmitting] = useState()
  const [success, setSuccess] = useState()

  if (session) {
    console.log("should never get this if first signing up")
    router.push('/')
    return <h1 className="container text-4xl font-light text-center mt-52"><VscLoading className="inline mb-3 mr-5 animate-spin" size=".8em" />Redirecting</h1>
  }

  if (success) {
    // redirect should not be necessary here, but to prevent soft lock best to be safe
    setTimeout(() => router.push('/'), 8000)
    return <h1 className="container text-4xl font-light text-center mt-52"><IoMdHappy className="inline mb-2 mr-3 animate-bounce" size="1.2em" />Account Created</h1>
  }

  function onSubmit(data) {
    setSubmitting(true)
    fetch("/api/user", {
      method: 'POST', 
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        alias: data.alias
      })
    })
    .then(res => res.json())
    .then(res => {
      if (res.err) throw res.err
      if (!res.created) throw "could not create"
      setSuccess(true)
      signIn('credentials', {
        email: data.email,
        password: data.password,
        callbackUrl: callbackUrl || '/'
      })
    })
    .catch(err => {
     let description = 'Invalid Signup'
      if (err === "allowlist") {
        description = 'This email is not present on the allowlist, contact the site administrator for assistance'
      } else if (err === "dup") {
        description = 'This email is already registered'
      } else { // 500
        console.error(err)
      }
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description,
      })
    })
    .finally(() => setSubmitting(false))
  }

  return (
    <div className="container gridw-full max-w-md items-center gap-1.5">
      <h1 className="mb-5 text-6xl font-light">Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Label className={cn(errors.email && "text-destructive", "text-2xl")}>
          <IoIosMail className="inline mb-1 me-2" size="1.4em" />Email
        </Label>
        <Controller
          render={({ field }) => <Input placeholder="your@email.com" type="email" className="mt-0" {...field} />}
          rules={{ required: true }}
          control={control}
          name="email"
        />
        {errors.email 
          &&  <p className="text-sm font-medium text-destructive">
                Please enter a valid email
              </p>
        }

        <div className="mt-2"></div>
        <Label className={cn(errors.alias && "text-destructive", "text-2xl")}>
          <IoIosPerson className="inline mb-1 me-2" size="1.4em" />Alias
        </Label>
        <Controller
          render={({ field }) => <Input placeholder="alias" className="mt-0" {...field} />}
          rules={{ required: true }}
          control={control}
          name="alias"
        />
        {errors.alias 
          &&  <p className="text-sm font-medium text-destructive">
                Please enter an alias
              </p>
        }

        <div className="mt-2"></div>
        <Label className={cn(errors.password && "text-destructive", "text-2xl")}>
          <IoIosKey className="inline mb-1 me-2" size="1.4em" />Password
        </Label>
        <Controller
          render={({ field }) => <Input placeholder="*********" type="password" {...field} />}
          rules={{ required: true, minLength:8 }}
          control={control}
          name="password"
        />
        {errors.password 
          &&  <p className="text-sm font-medium text-destructive">
                Your password must be at least 8 characters
              </p>
        }

        <Button disabled={submitting} className="w-full mt-5" >
          {submitting
            ? <><VscLoading className="h-4 mr-5 animate-spin" />Please Wait</>
            : "Login"
          }
        </Button>
        <Link className="w-full text-blue-800" href="/auth/signin" passHref>
          <Button variant="ghost" className="w-full mt-5">
            Already have an account? Sign in.
          </Button>
        </Link>
      </form>
    </div>
  )
}