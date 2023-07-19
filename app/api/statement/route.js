import { Statement, User } from '@/models'
import dbConnect from '@/util/db'
import { getServerSession } from "next-auth/next"
import mongoose from 'mongoose'
import aggregate from '@/util/aggregate'
import options from "@/util/auth"
// import { revalidatePath } from 'next/cache'
// import { NextResponse } from 'next/server'

export async function PUT(req) {
  try {
    const session = await getServerSession(options)
    if (!session) throw "unauthorized"
    const body = await req.json()
    await dbConnect()
    
    for (const obj of body) {
      // TODO: could detect changes smarter here
      if (isNaN(Number(obj.data.amount))) {
        throw 'Cannot cast amount to Number'
      }
      await Statement.findByIdAndUpdate(
        obj.id,
        {
          amount: Number(obj.data.amount),
          createdAt: obj.data.date,
          description: obj.data.desc
        }
      ).catch(err => {throw err._message})
    }
    // TODO: find out how often the cache will last 
    // revalidatePath("/")
    return Response.json({msg: 'hi'})
  } catch (err) {
    console.log(err)
    if (typeof err === 'string') {
      return new Response(err, { status: 400 })
    } else {
      return new Response(err, { status: 500 })
    }
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(options)
    if (!session) throw "unauthorized"
    await dbConnect()
    const _id = req.nextUrl.searchParams.get("id")
  
    const user = await User.findOne({ email: session.user.email.toLowerCase() })
    if (!user.admin) throw 'unathorized'
    const statement = await Statement.deleteOne({ _id })
      .catch(err => {throw err._message})
    return Response.json(statement)
  } catch (err) {
    console.log(err)
    if (typeof err === 'string') {
      return new Response(err, { status: 400 })
    } else {
      return new Response(err, { status: 500 })
    }
  }
}

export async function GET() {
  try {
    const session = await getServerSession(options)
    if (!session) throw "unauthorized"
    await dbConnect()
    const aggRaw = await aggregate()
      .catch(err => {throw err})
    const agg = await aggRaw.json()
    console.log(agg)
    const day = (new Date().getDay() + 6) % 7
    const solarRaw = await Daily.find({ day }).sort({ createdAt: 1 })
    const solar = await solarRaw.json()

    return Response.json({agg, solar})
  } catch (err) {
    if (err.message === "unauthorized") {
      return new Response.json(err, { status: 400 })
    }
    return new Response.json(err, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(options)
    if (!session) throw "unauthorized"
    const body = await req.json()
    await dbConnect()

    const user = await User.findOne({ email: session.user.email.toLowerCase() })
    if (!user) throw `Could Not find ${session.user.email}`
    if (!body.date) throw `date ${body.date}`
    const statement = await Statement.create({
      user: user.id, 
      alias: user.alias, 
      description: body.description, 
      amount: Number(body.amount), 
      createdAt: body.date
    })
      .catch(err => {throw err._message})
    return Response.json(statement)
  } catch (err) {
    console.log(err)
    if (typeof err === 'string') {
      return new Response(err, { status: 400 })
    } else {
      return new Response(err, { status: 500 })
    }
  }
}