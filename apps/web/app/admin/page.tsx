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
  const logout = useOwnerStore((s) => s.logout)
  const [mounted, setMounted] = useState(false)
  const { showToast } = useToast()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted && !ownerMode) {
      router.push('/')
    }
  }, [mounted, ownerMode, router])

  if (!mounted || !ownerMode) return null

  const handleLogout = () => {
    logout()
    showToast('Keluar dari mode pemilik', 'info')
    router.push('/')
  }

  return (
    <div className="container py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <p className="text-muted-foreground">Kelola profil dan proyek Anda.</p>
        </div>
        <button onClick={handleLogout} className="rounded-md border border-gray-700 px-4 py-2 text-sm hover:bg-gray-800">
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