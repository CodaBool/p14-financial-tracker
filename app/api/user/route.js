import { User } from '@/models'
import dbConnect from '@/util/db'

export async function POST(req) {
  try {
    const body = await req.json()
    await dbConnect()
    const allowedList = process.env.ALLOWLISTED_EMAILS || ''
    let arr = allowedList.split(',') || []
    arr = arr.map(email => email.toLowerCase())
    const allowed = arr.includes(body.email.toLowerCase())
    if (!allowed) throw 'Email not on allow list'
    await User.create({
      email: body.email,
      password: body.password,
      alias: body.alias
    })
      .then(resp => {
        if (resp.code === 11000) throw 'User already exists'
        res.status(200).json(resp)
      })
      .catch(err => {
        if (err.code === 11000) throw 'User already exists'
        console.log(err)
        throw err._message
      })
  } catch (err) {
    if (typeof err === 'string') {
      return new Response(err, { status: 400 })
    } else {
      return new Response(err, { status: 500 })
    }
  }
}