import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from 'bcryptjs'
import dbConnect from '@/lib/db'
import { User } from '@/lib/models'

export const authOptions =  {
  session: {
    strategy: "jwt",
    maxAge: 31556952, // in seconds (31,556,952 = 1 year), comment out for added security
  },
  // I don't think I need to mess with the session/JWT anymore since next-auth has great utility func now
  // callbacks: {
  //   async session({ session, token, user }) {
  //     if (session) session.id = token.sub
  //     return Promise.resolve(session)
  //   },
  //   async jwt({ token, user }) {
  //     if (token) token.id = token.sub
  //     return Promise.resolve(token)
  //   }
  // },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    newUser: '/auth/signup',
    error: '/auth/signin', // Error code passed in query string as ?error=
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Email' },
        password: { label: "Password", type: "password" },
      },
      async authorize(clientData) {
        await dbConnect()
        const user = await User.findOne({ email: clientData.email })
        if (!user) throw new Error("nonexistant")
        const valid = await compare(clientData.password,user.password)
        if (valid) return { id: user._id, email: user.email }
        throw new Error("invalid")
      }
    }),
  ],
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }