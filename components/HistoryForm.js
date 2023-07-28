'use client'
import React, { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from './ui/button'
import { VscLoading } from 'react-icons/vsc'
import { IoAddCircleOutline, IoCalendar } from 'react-icons/io5'
import { Input } from "./ui/input"
import { cn } from "@/lib/utils"
import { CalendarInput } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from './ui/use-toast'
import { useRouter } from 'next/navigation'

export default function HistoryForm() {
  const { handleSubmit, formState: { errors }, control, reset, setError } = useForm()
  const [date, setDate] = useState(new Date())
  const [submitting, setSubmitting] = useState()
  const ref = useRef()
  const { toast } = useToast()
  const router = useRouter()

  async function onSubmit(body) {
    body.date = date
    setSubmitting(true)
    const res = await fetch('/api/statement', {
      method: 'POST',
      body: JSON.stringify(body)
    })
    const ress = await res.json()
    reset({amount: '', description: ''})
    setSubmitting(false)
    if (res.ok) {
      toast({
        title: "Row Added",
        description: `The ${ress.description} item for $${ress.amount} has been added`
      })
      router.refresh()
      return
    }
    toast({
      variant: "destructive",
      title: "The item could not be added",
      description: ress.err,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} >
      <div className="flex items-center">
        <div className="flex p-2" style={{width: '100%'}}>Date</div>
        <div className="flex p-2" style={{width: '100%'}}>Description</div>
        <div className="flex p-2" style={{width: '100%'}}>Amount</div>
      </div>
      <div className="flex items-center mb-3">
        <CalendarInput date={date} setDate={setDate} />
        <Controller
          render={({ field }) => <Input className="flex" placeholder="Energy" {...field} />}
          rules={{ required: true }}
          control={control}
          name="description"
        />
        <Controller
          render={({ field }) => <Input className="flex" placeholder="Dollars" type="number" {...field} />}
          rules={{ required: true }}
          control={control}
          name="amount"
        />
        <Button disabled={submitting} variant="ghost" className="w-5%" >
          {submitting
            ? <VscLoading className="h-4 mr-5 animate-spin" />
            : <IoAddCircleOutline size="1.8em" />
          }
        </Button>
      </div>
      {(errors.amount || errors.description) &&
        <p className="text-sm font-medium text-center text-destructive">
          Please enter a valid amount and description
        </p>
      }
    </form>
  )
}
