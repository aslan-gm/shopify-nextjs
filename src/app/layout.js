'use client'

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

import { useEffect } from 'react'

import Header from '@/components/header'
import { useCart } from '@/utils'

import '@/scss/app.scss'

export default function RootLayout({ children }) {
  const { initializeCart } = useCart()

  useEffect(() => {
    initializeCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  )
}
