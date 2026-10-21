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
  const [mobileOpen, setMobileOpen] = useState(false)
  const ownerMode = useOwnerStore((s) => s.ownerMode)

  useEffect(() => {
    if (ownerMode && pathname !== '/admin') {
      router.push('/admin')
    }
  }, [ownerMode, router, pathname])

  const closeMobile = () => setMobileOpen(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur-sm">
      <nav className="container flex h-16 items-center justify-between" aria-label="Main navigation">
        <Link href="/" onDoubleClick={(e) => { e.preventDefault(); setPinOpen(true) }} className="flex items-center gap-2 font-mono text-xl font-semibold text-primary cursor-pointer" aria-label="Go to homepage">
          rhaditya.me
        </Link>

        {/* Desktop nav links - hanya muncul di layar md ke atas */}
        <div className="hidden md:flex items-center gap-4">
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

        {/* Hamburger button - hanya muncul di mobile */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          <span className="sr-only">Menu</span>
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu - drawer + backdrop, hanya muncul di mobile */}
      {mobileOpen && (
        <div className="md:hidden">
          {/* Backdrop - tutup menu saat diklik di luar */}
          <div
            className="fixed inset-0 z-40 bg-black/60"
            onClick={closeMobile}
            aria-hidden="true"
          />
          {/* Drawer - slide from right */}
          <div className="fixed right-0 top-0 z-50 h-full w-64 max-w-[80%] bg-gray-950 border-l border-gray-800 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-800 px-4 py-4">
              <span className="font-mono text-lg font-semibold text-primary">Menu</span>
              <button
                type="button"
                onClick={closeMobile}
                className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-gray-800"
                aria-label="Tutup menu"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-4 py-6 space-y-1">
              {ownerMode && (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-red-600/50 bg-red-600/10 px-2.5 py-1 text-xs font-mono font-medium text-red-400 mb-4">
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
                    onClick={closeMobile}
                    className={`block w-full rounded-md px-3 py-3 text-left font-mono text-sm font-medium uppercase tracking-wider transition-colors ${
                      isActive
                        ? 'bg-red-600/10 text-primary'
                        : 'text-muted-foreground hover:bg-gray-800 hover:text-foreground'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <PinPrompt open={pinOpen} onClose={() => setPinOpen(false)} />
    </header>
  )
}