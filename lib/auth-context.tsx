'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  isVerified: boolean
  gender?: string
}

interface AuthContextType {
  user: AuthUser | null
  login: (user: AuthUser) => void
  logout: () => void
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  mounted: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  mounted: false,
})

// Legacy insecure client-side session key. It is only ever deleted now.
const LEGACY_STORAGE_KEY = 'mithila_milan_auth_user'

/**
 * Session state is derived from the server: the HttpOnly session cookie is the only credential
 * and `/api/auth/me` is the only source of identity. Nothing identity-related is stored in
 * localStorage, so editing browser storage cannot change who or what you are.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY)
    } catch {}

    let cancelled = false
    const refresh = () =>
      fetch('/api/auth/me', { credentials: 'same-origin', cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!cancelled) setUser(data?.ok && data.user ? data.user : null)
        })
        .catch(() => {
          if (!cancelled) setUser(null)
        })
        .finally(() => {
          if (!cancelled) setMounted(true)
        })

    refresh()
    window.addEventListener('mithila_auth_changed', refresh)
    window.addEventListener('focus', refresh)
    return () => {
      cancelled = true
      window.removeEventListener('mithila_auth_changed', refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [])

  // The server has already established the session cookie; this only updates the UI state.
  const login = (newUser: AuthUser) => {
    setUser(newUser)
    setIsAuthModalOpen(false)
  }

  const logout = () => {
    setUser(null)
    fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
      .catch(() => {})
      .finally(() => window.dispatchEvent(new Event('mithila_auth_changed')))
  }

  return (
    <AuthContext.Provider
      value={{
        user: mounted ? user : null,
        login,
        logout,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        mounted,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
