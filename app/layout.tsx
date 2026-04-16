import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { AuthProvider } from "@/components/auth-provider"
import ButtonDownload from '@/components/button-download';

export const metadata: Metadata = {
  title: "MediSuiv - Suivi Médical",
  description: "MediSuiv est une plateforme de suivi médical moderne construite avec Next.js, React et Tailwind CSS. Elle permet de gérer les alertes, notifications et microservices médicaux.",
  generator: "MediSuiv",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      // Put font variables and antialiasing on html so they apply before hydration.
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      // Ensure a default brand so color theming is active before hydration.
      data-brand="medical-blue"
    >
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="relative flex h-screen flex-col">
              <Navbar />
              <div className="flex-1 overflow-auto">
                <Suspense fallback={null}>
                  <main className="flex-1">{children}</main>
                </Suspense>
              </div>
            </div>
          </AuthProvider>
          <Analytics />
        </ThemeProvider>
        <ButtonDownload />
      </body>
    </html>
  )
}
