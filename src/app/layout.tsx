import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
// import AuthProvider from '@/components/AuthProvider';
import { Providers } from "./providers"
import SidebarWrapper from "@/components/global/SidebarWrapper"
import { SidebarProvider } from "@/components/global/SidebarContext"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "SmartSnip",
  description:
    "Highlight, save notes, and get AI-powered insights directly from your browser. Boost productivity with SmartSnip!",
  authors: [{ name: "Amitesh Verma", url: "https://x.com/AmitesH2419" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <SidebarProvider>
            <SidebarWrapper>{children}</SidebarWrapper>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  )
}
