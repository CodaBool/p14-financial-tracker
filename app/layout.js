import './globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Provider from '@/components/Provider'
import Navigation from '@/components/Navigation'

export const metadata = {
  title: 'Financial Tracker',
  description: 'Selfhost solution to view details for your own personal finances',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <Navigation />
          {children}
        </Provider>
      </body>
    </html>
  )
}