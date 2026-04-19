import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { StudentProvider } from '@/lib/context/StudentContext'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'EduEspecial',
  description: 'Asistente para profesoras de educación especial',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <StudentProvider>
          {children}
        </StudentProvider>
      </body>
    </html>
  )
}
