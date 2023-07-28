import { User, Statement } from '@/lib/models'
import dbConnect from '@/lib/db'
import { getServerSession } from "next-auth/next"
import aggregate from '@/lib/aggregate'
import { authOptions } from '../auth/[...nextauth]/route'
// import { revalidatePath } from 'next/cache'

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) throw "unauthorized"
    const body = await req.json()
    console.log('date', body.date)
    await dbConnect()
    await Statement.findByIdAndUpdate(body.id, {
      amount: Number(body.amount),
      createdAt: body.date,
      description: body.description
    })
    // TODO: find out how often the cache will last 
    // revalidatePath("/")
    return Response.json({saved: true})
  } catch (err) {
    console.error(err)
    if (typeof err === 'string') {
      return Response.json({err}, { status: 400 })
    } else if (typeof err?.message === "string") {
      return Response.json({err: err.message}, { status: 500 })
    } else {
      return Response.json(err, { status: 500 })
    }
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) throw "unauthorized"
    await dbConnect()
    const _id = req.nextUrl.searchParams.get("id")
    console.log('id', _id)
    const user = await User.findOne({ email: session.user.email.toLowerCase() })
    if (!user.admin) throw 'unathorized'
    const statement = await Statement.deleteOne({ _id })
    return Response.json(statement)
  } catch (err) {
    console.error(err)
    if (typeof err === 'string') {
      return Response.json({err}, { status: 400 })
    } else if (typeof err?.message === "string") {
      return Response.json({err: err.message}, { status: 500 })
    } else {
      return Response.json(err, { status: 500 })
    }
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) throw "unauthorized"
    await dbConnect()
    const aggRaw = await aggregate()
      .catch(err => {throw err})
    const agg = await aggRaw.json()
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
    const session = await getServerSession(authOptions)
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
    return Response.json(statement)
  } catch (err) {
    console.error(err)
    if (typeof err === 'string') {
      return Response.json({err}, { status: 400 })
    } else if (typeof err?.message === "string") {
      return Response.json({err: err.message}, { status: 500 })
    } else {
      return Response.json(err, { status: 500 })
    }
  }
}