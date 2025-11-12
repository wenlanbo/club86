import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Club86 - Luxury Agency",
  description: "Creative + Analytical. Luxury-forward brand building.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-lemon-milk">{children}</body>
    </html>
  )
}

