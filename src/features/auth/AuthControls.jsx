import { useEffect, useRef, useState } from 'react'
import { ChevronDown, LogIn, LogOut, UserRound } from 'lucide-react'

function AuthControls({ user, isLoading, onLogin, onProfile, onSignOut }) {
  const displayName = user?.user_metadata?.full_name?.trim() || user?.email || 'Account'
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    if (!userMenuOpen) return undefined

    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target)) setUserMenuOpen(false)
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setUserMenuOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [userMenuOpen])

  function handleProfileClick() {
    setUserMenuOpen(false)
    onProfile()
  }

  function handleSignOutClick() {
    setUserMenuOpen(false)
    onSignOut()
  }

  return (
    <div className="auth-controls">
      {user ? (
        <div className="auth-user-menu" ref={menuRef}>
          <button
            ref={triggerRef}
            className="login-button auth-user-trigger"
            type="button"
            aria-expanded={userMenuOpen}
            aria-controls="auth-user-dropdown"
            onClick={() => setUserMenuOpen((current) => !current)}
          >
            <span title={displayName}>{displayName}</span>
            <ChevronDown size={14} aria-hidden="true" />
          </button>
          {userMenuOpen && (
            <div className="auth-user-dropdown" id="auth-user-dropdown">
              <button type="button" onClick={handleProfileClick}>
                <UserRound size={15} /> Profile
              </button>
              <button type="button" onClick={handleSignOutClick}>
                <LogOut size={15} /> Sign out
              </button>
            </div>
          )}
        </div>
      ) : (
        <button className="login-button" type="button" onClick={onLogin} disabled={isLoading}>
          <LogIn size={15} /> {isLoading ? 'Checking session' : 'Login'}
        </button>
      )}
    </div>
  )
}

export default AuthControls