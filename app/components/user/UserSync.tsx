'use client'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'

export function UserSync() {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user) return

      try {
        const response = await fetch('/api/users/sync', {
          method: 'POST'
        })
        
        if (response.ok) {
          console.log('✅ Usuario sincronizado en Supabase')
        } else {
          console.log('❌ Error en sync')
        }
      } catch (error) {
        console.log('❌ Error en sync:', error)
      }
    }

    syncUser()
  }, [user, isLoaded])

  return null
}