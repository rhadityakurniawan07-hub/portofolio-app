'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, User, Briefcase, Settings } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Data Diri', icon: User },
  { href: '/projects', label: 'Koleksi Proyek', icon: Briefcase },
] as const

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [ownerMode, setOwnerMode] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur-sm">
      <nav className="container flex h-16 items-center justify-between" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-2 font-mono text-xl font-semibold text-primary" aria-label="Go to homepage">
          rhaditya.me
        </Link>

        <div className="hidden md:flex md:items-center md:gap-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          {ownerMode && (
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-400 ring-1 ring-green-500/30">
              <Settings className="h-3 w-3" aria-hidden="true" />
              MODE PEMILIK AKTIF
            </span>
          )}

          <button
            onClick={() => setOwnerMode(!ownerMode)}
            className="hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-800"
            aria-label={ownerMode ? 'Disable owner mode' : 'Enable owner mode'}
            aria-pressed={ownerMode}
          >
            <User className="h-4 w-4" aria-hidden="true" />
            <span>{ownerMode ? 'Keluar' : 'Masuk'}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:text-foreground hover:bg-gray-800"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-200 ${
          mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="space-y-1 px-4 pb-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-800 text-primary'
                    : 'text-muted-foreground hover:bg-gray-800 hover:text-foreground'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {item.label}
              </Link>
            )
          })}

          <div className="border-t border-gray-800 my-2" />

          <button
            onClick={() => setOwnerMode(!ownerMode)}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground hover:bg-gray-800 hover:text-foreground transition-colors"
            aria-pressed={ownerMode}
          >
            <User className="h-5 w-5" aria-hidden="true" />
            {ownerMode ? 'Keluar Mode Pemilik' : 'Masuk Mode Pemilik'}
          </button>

          {ownerMode && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400 ring-1 ring-green-500/30">
              <Settings className="h-3 w-3" aria-hidden="true" />
              MODE PEMILIK AKTIF
            </span>
          )}
        </div>
      </div>
    </header>
  )
}