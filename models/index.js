import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    maxlength: 35,
    trim: true
  },
  alias: {
    type: String,
    required: true,
    maxlength: 35,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    trim: true,
    required: true
  },
  admin: { 
    type: Boolean, 
    default: false 
  },
}, { timestamps: true })

const statementSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  alias: {
    type: String,
    required: true,
    maxlength: 35,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    default: 'Mortgage'
  },
  tags: {
    type: [String],
    default: ['Mortgage']
  },
  status: String,
  dueDate: String,
  type: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const senseDailySchema = new Schema({
  usage: Number,
  solar: Number,
  day: Number,
  createdAt: Date,
  expireAt: Date,
})

const senseMonthlySchema = new Schema({
  average_usage: Number,
  average_solar: Number,
  month: Number,
  year: Date,
  createdAt: Date,
  expireAt: Date,
})

export const User = mongoose.models.user || mongoose.model('user', userSchema)
export const Statement = mongoose.models.statement || mongoose.model('statement', statementSchema)
export const Daily = mongoose.models.day || mongoose.model('day', senseDailySchema)
export const Monthly = mongoose.models.month || mongoose.model('month', senseMonthlySchema)