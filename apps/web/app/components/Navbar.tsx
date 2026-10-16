'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, User, Briefcase, Settings, Mail, MessageSquare, Briefcase as BriefcaseIcon } from 'lucide-react'
import { PinPrompt } from './PinPrompt'
import { BackupButtons } from './BackupButtons'
import { useOwnerStore } from '@/stores/use-owner'

const navItems = [
  { href: '/', label: 'BERANDA', icon: Mail },
  { href: '/projects', label: 'CV', icon: BriefcaseIcon },
  { href: '/about', label: 'TENTANG SAYA', icon: BriefcaseIcon },
  { href: '/contact', label: 'KONTAK', icon: MessageSquare },
] as const

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [pinOpen, setPinOpen] = useState(false)
  const ownerMode = useOwnerStore((s) => s.ownerMode)
  const logout = useOwnerStore((s) => s.logout)

  const handleOwnerClick = () => {
    if (ownerMode) {
      logout()
    } else {
      setPinOpen(true)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur-sm">
      <nav className="container flex h-16 items-center justify-between" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-2 font-mono text-xl font-semibold text-primary" aria-label="Go to homepage">
          rhaditya.me
        </Link>

        <div className="hidden md:flex md:items-center md:gap-8">
          {navItems.map((item) => {
            const Icon = item.icon
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
                <Icon className="h-4 w-4 mr-2" aria-hidden="true" />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-4">
          {ownerMode && (
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-gray-700 bg-gray-900/50 px-2.5 py-0.5 text-xs font-mono font-medium text-green-400 ring-1 ring-green-500/30">
              <Settings className="h-3 w-3" aria-hidden="true" />
              MODE PEMILIK AKTIF
            </span>
          )}

          {ownerMode && (
            <span className="hidden sm:inline-flex">
              <BackupButtons />
            </span>
          )}

          <button
            onClick={handleOwnerClick}
            className="hidden sm:flex items-center gap-1.5 rounded-md border border-gray-700 bg-transparent px-3 py-1.5 text-sm font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:bg-gray-800 hover:text-foreground focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black"
            aria-label={ownerMode ? 'Disable owner mode' : 'Enable owner mode'}
            aria-pressed={ownerMode}
          >
            <User className="h-4 w-4" aria-hidden="true" />
            <span>{ownerMode ? 'KELUAR' : 'MASUK'}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-foreground hover:bg-gray-800 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black"
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
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-base font-mono font-medium uppercase tracking-wider transition-colors ${
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
            onClick={handleOwnerClick}
            className="w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-base font-mono font-medium uppercase tracking-wider text-muted-foreground hover:bg-gray-800 hover:text-foreground transition-colors"
            aria-pressed={ownerMode}
          >
            <User className="h-5 w-5" aria-hidden="true" />
            {ownerMode ? 'KELUAR MODE PEMILIK' : 'MASUK MODE PEMILIK'}
          </button>

          {ownerMode && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-700 bg-gray-900/50 px-3 py-1 text-xs font-mono font-medium text-green-400">
              <Settings className="h-3 w-3" aria-hidden="true" />
              MODE PEMILIK AKTIF
            </span>
          )}

          {ownerMode && (
            <div className="px-3 py-1.5">
              <BackupButtons />
            </div>
          )}
        </div>
      </div>
      <PinPrompt open={pinOpen} onClose={() => setPinOpen(false)} />
    </header>
  )
}