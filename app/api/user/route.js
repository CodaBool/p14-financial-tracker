import { User } from '@/lib/models'
import dbConnect from '@/lib/db'
import { hashSync, genSaltSync } from 'bcryptjs'

export async function POST(req) {
  try {
    const body = await req.json()
    await dbConnect()
    const allowedList = process.env.ALLOWLISTED_EMAILS || ''
    let arr = allowedList.split(',') || []
    arr = arr.map(email => email.toLowerCase())
    const allowed = arr.includes(body.email.toLowerCase())
    if (!allowed) throw 'allowlist'
    const hash = hashSync(body.password, genSaltSync(10))
    await User.create({
      email: body.email,
      password: hash,
      alias: body.alias
    })
    return Response.json({created: true})
  } catch (err) {
    console.log(err)
    if (typeof err === 'string') {
      return Response.json({err}, { status: 400 })
    } else if (err?.errors?.password?.kind === "minlength") {
      return Response.json({err: "minlength"}, { status: 400 })
    } else if (err?.code === 11000) {
      return Response.json({err: "dup"}, { status: 400 })
    } else if (typeof err?.message === "string") {
      return Response.json({err: err.message}, { status: 500 })
    } else {
      return Response.json(err, { status: 500 })
    }
  }
}