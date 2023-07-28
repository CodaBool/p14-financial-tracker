import './globals.css'
// import { Anek_Bangla } from 'next/font/google'
import Provider from '@/components/Provider'

// Albert Sans
// Aleo
// Anek Bangla
// Cabin
// DM Sans
// Dosis

export const metadata = {
  title: 'Financial tracker',
  description: 'Self host solution to managing and monitoring bills',
}
import { Toaster } from "@/components/ui/toaster"

// const inter = Anek_Bangla({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        <Provider>
          <Toaster />
          {/* <Navigation /> */}
          {children}
        </Provider>
      </body>
    </html>
  )
}