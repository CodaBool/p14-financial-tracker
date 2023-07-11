import mongoose from 'mongoose'
mongoose.set('strictQuery', true)
const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
  throw new Error(
    'Please define the MONGO_URI environment variable inside .env'
  )
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
  
}

export default async function() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false
    }

    cached.promise = mongoose.connect(MONGO_URI, opts).then(mongoose => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export function jparse(obj) {
  return JSON.parse(JSON.stringify(obj))
}