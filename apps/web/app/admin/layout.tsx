import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin — Rhaditya.me',
  description: 'Dashboard admin untuk mengelola profil dan proyek.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}