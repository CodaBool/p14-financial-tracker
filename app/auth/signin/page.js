'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IoIosMail, IoIosKey } from 'react-icons/io'
import { VscLoading } from 'react-icons/vsc'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm, Controller } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast.js"
import { useEffect, useState } from "react"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

export default function Signin() {
  const { handleSubmit, formState: { errors }, control } = useForm()
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const authError = searchParams.get("error")
  const callbackUrl = searchParams.get("callbackUrl")
  const router = useRouter()
  const [submitting, setSubmitting] = useState()
  const { toast } = useToast()

  useEffect(() => {
    setSubmitting(false)
    if (!authError) return
    let description = "Something went wrong"
    if (authError === 'nonexistant') {
      description = "No account found under that email"
    } else if (authError === 'invalid') {
      description = 'Invalid login'
    }
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description,
    })
  }, [authError])

  if (session) {
    router.push('/')
    return <h1 className="container text-4xl font-light text-center mt-52"><VscLoading className="inline mb-3 mr-5 animate-spin" size=".8em" />Redirecting</h1>
  }

  function onSubmit(data) {
    setSubmitting(true)
    signIn('credentials', {
      email: data.email,
      password: data.password,
      callbackUrl: callbackUrl || '/'
    })
  }

  return (
    <div className="container grid p-5 w-full max-w-md items-center gap-1.5 mt-5">
      <h1 className="mb-5 text-6xl font-light">Sign In</h1>
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
        <Link className="w-full text-blue-800" href="/auth/signup" passHref>
          <Button variant="ghost" className="w-full mt-5">
            New Around? Signup Here.
          </Button>
        </Link>
      </form>
    </div>
  )
}