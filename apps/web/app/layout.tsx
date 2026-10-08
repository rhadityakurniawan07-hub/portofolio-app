import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from './components/Navbar'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MUHAMMAD RHADITYA KURNIAWAN | Full-Stack Web Developer',
  description: 'Portofolio pribadi MUHAMMAD RHADITYA KURNIAWAN - Full-Stack Web Developer specializing in Next.js, Node.js, PostgreSQL, dan Tailwind CSS',
  keywords: ['Full-Stack Developer', 'Next.js', 'Node.js', 'React', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
  authors: [{ name: 'MUHAMMAD RHADITYA KURNIAWAN' }],
  openGraph: {
    title: 'MUHAMMAD RHADITYA KURNIAWAN | Full-Stack Web Developer',
    description: 'Portofolio pribadi MUHAMMAD RHADITYA KURNIAWAN',
    type: 'website',
    locale: 'id_ID',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}