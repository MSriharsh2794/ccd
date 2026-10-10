import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from './supabaseClient.js'

const missingConfigurationMessage = 'Authentication is not configured. Add the Supabase URL and anon key to your .env file.'
const adminEmail = 'codecomputedeploy@gmail.com'

export function useAuthentication() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState('user')
  const [authMode, setAuthMode] = useState('login')
  const [session, setSession] = useState(null)
  const [message, setMessage] = useState('')
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured)
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return undefined
    }

    let active = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) setSession(nextSession)
    })

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return
      if (error) setMessage(error.message)
      setSession(data.session)
      setAuthLoading(false)
    }).catch((error) => {
      if (!active) return
      setMessage(error.message || 'Could not restore your session.')
      setAuthLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const openLogin = useCallback(() => {
    setSelectedRole('user')
    setAuthMode('login')
    setMessage('')
    setLoginOpen(true)
  }, [])

  const closeLogin = useCallback(() => setLoginOpen(false), [])
  const openProfile = useCallback(() => setProfileOpen(true), [])
  const closeProfile = useCallback(() => setProfileOpen(false), [])
  const selectRole = useCallback((nextRole) => {
    setSelectedRole(nextRole)
    if (nextRole === 'admin') setAuthMode('login')
    setMessage('')
  }, [])
  const changeAuthMode = useCallback((nextMode) => {
    setAuthMode(nextMode)
    setSelectedRole('user')
    setMessage('')
  }, [])

  async function submitAuth(event, selectedTechnologies = []) {
    event.preventDefault()
    if (!isSupabaseConfigured) {
      setMessage(missingConfigurationMessage)
      return
    }

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') || '').trim()
    const password = String(formData.get('password') || '')
    setSigningIn(true)
    setMessage('')

    try {
      if (authMode === 'register') {
        const fullName = String(formData.get('full_name') || '').trim()
        const dateOfBirth = String(formData.get('date_of_birth') || '')
        const city = String(formData.get('city') || '')
        const country = String(formData.get('country') || '')
        const technologies = selectedTechnologies

        if (!fullName || !dateOfBirth || !city || !country || technologies.length === 0) {
          setMessage('Complete your profile and save at least one learning interest before registering.')
          return
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: fullName,
              date_of_birth: dateOfBirth,
              city,
              country,
              technologies,
            },
          },
        })
        if (error) throw error

        if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
          setMessage('You already have an account. Please sign in instead.')
          return
        }

        if (data.session) {
          setLoginOpen(false)
        } else {
          setMessage('Account created. Check your email to confirm your account before signing in.')
        }
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      const signedInEmail = data.user?.email?.trim().toLowerCase()
      const hasAdminAccess = signedInEmail === adminEmail

      if (selectedRole === 'admin' && !hasAdminAccess) {
        await supabase.auth.signOut()
        setMessage('Administrator access is limited to the configured admin email.')
        return
      }

      setLoginOpen(false)
      if (hasAdminAccess) window.location.assign('/admin')
    } catch (error) {
      const duplicateEmail = authMode === 'register' && (
        error.code === 'user_already_exists'
        || error.code === 'email_exists'
        || /already registered|already exists/i.test(error.message || '')
      )
      setMessage(duplicateEmail
        ? 'You already have an account. Please sign in instead.'
        : error.message || 'Sign-in failed. Please try again.')
    } finally {
      setSigningIn(false)
    }
  }

  async function signOut() {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) setMessage(error.message)
    else setProfileOpen(false)
  }

  const user = session?.user || null
  const isAdmin = user?.email?.trim().toLowerCase() === adminEmail

  return {
    loginOpen,
    profileOpen,
    selectedRole,
    authMode,
    message,
    authLoading,
    signingIn,
    isSupabaseConfigured,
    user,
    isAdmin,
    openLogin,
    closeLogin,
    openProfile,
    closeProfile,
    selectRole,
    changeAuthMode,
    submitAuth,
    signOut,
  }
}