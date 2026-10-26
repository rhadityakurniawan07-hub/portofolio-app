'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useOwnerStore } from '@/stores/use-owner'
import { useToast } from '@/components/Toast'
import { ProfileEditPanel } from '../components/ProfileEditPanel'
import { ProjectsSection } from '../components/ProjectsSection'

export default function AdminPage() {
  const router = useRouter()
  const ownerMode = useOwnerStore((s) => s.ownerMode)
  const checking = useOwnerStore((s) => s.checking)
  const refresh = useOwnerStore((s) => s.refresh)
  const logout = useOwnerStore((s) => s.logout)
  const [mounted, setMounted] = useState(false)
  const { showToast } = useToast()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted) void refresh()
  }, [mounted, refresh])

  useEffect(() => {
    if (mounted && !checking && !ownerMode) {
      router.push('/')
    }
  }, [mounted, checking, ownerMode, router])

  if (!mounted || checking || !ownerMode) return null

  const handleLogout = async () => {
    await logout()
    showToast('Keluar dari mode pemilik', 'info')
    router.push('/')
  }

  return (
    <div className="container py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold">Dashboard Admin</h1>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-red-600/50 bg-red-600/10 px-2.5 py-1 text-xs font-mono font-medium text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              ADMIN MODE
            </span>
          </div>
          <p className="text-muted-foreground">Kelola profil dan proyek Anda.</p>
        </div>
        <button onClick={() => void handleLogout()} className="rounded-md border border-gray-700 px-4 py-2 text-sm hover:bg-gray-800">
          Keluar
        </button>
      </div>

      <ProfileEditPanel />

      <div className="mt-12">
        <h2 className="mb-4 text-2xl font-bold">Kelola Proyek</h2>
        <ProjectsSection />
      </div>
    </div>
  )
}
