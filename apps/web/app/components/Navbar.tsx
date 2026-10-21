'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { PinPrompt } from './PinPrompt'
import { useOwnerStore } from '@/stores/use-owner'

const navItems = [
  { href: '/', label: 'BERANDA' },
  { href: '/#about-heading', label: 'TENTANG SAYA' },
  { href: '/#projects-heading', label: 'PROYEK' },
  { href: '/#kontak', label: 'KONTAK' },
] as const

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [pinOpen, setPinOpen] = useState(false)
  const ownerMode = useOwnerStore((s) => s.ownerMode)

  useEffect(() => {
    if (ownerMode && pathname !== '/admin') {
      router.push('/admin')
    }
  }, [ownerMode, router, pathname])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur-sm">
      <nav className="container flex h-16 items-center justify-between" aria-label="Main navigation">
        <Link href="/" onDoubleClick={(e) => { e.preventDefault(); setPinOpen(true) }} className="flex items-center gap-2 font-mono text-xl font-semibold text-primary cursor-pointer" aria-label="Go to homepage">
          rhaditya.me
        </Link>

        <div className="flex items-center gap-4">
          {ownerMode && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-red-600/50 bg-red-600/10 px-2.5 py-1 text-xs font-mono font-medium text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              ADMIN
            </span>
          )}
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-mono text-sm font-medium uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
      <PinPrompt open={pinOpen} onClose={() => setPinOpen(false)} />
    </header>
  )
}