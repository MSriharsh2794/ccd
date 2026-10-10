import { useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import LocationFields from './LocationFields.jsx'
import LearningPreferencesDialog from './LearningPreferencesDialog.jsx'

const latestDateOfBirth = new Date().toISOString().slice(0, 10)

function LoginDialog({ role, mode, message, signingIn, onRoleSelect, onModeChange, onClose, onSubmit }) {
  const [learningFormOpen, setLearningFormOpen] = useState(false)
  const [savedTechnologies, setSavedTechnologies] = useState(null)

  function handleRoleSelect(nextRole) {
    if (nextRole === 'admin') setSavedTechnologies(null)
    onRoleSelect(nextRole)
  }

  function handleModeChange(nextMode) {
    setSavedTechnologies(null)
    onModeChange(nextMode)
  }

  function saveLearningPreferences(technologies) {
    setSavedTechnologies(technologies)
    setLearningFormOpen(false)
  }

  return (
    <>
      <div className="story-backdrop" onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
        <section className="login-dialog" role="dialog" aria-modal="true" aria-labelledby="login-title">
          <button className="story-close" type="button" aria-label="Close login" autoFocus onClick={onClose}><X size={19} /></button>
          <p className="eyebrow"><span className="eyebrow-line" /> Account access</p>
          <h2 id="login-title">{mode === 'register' ? 'Create your account' : 'Login to Code Compute Deploy'}</h2>
          <p className="login-copy">
            {mode === 'register' ? 'Create a user account with your details.' : 'Choose an account type, then sign in with your Supabase credentials.'}
          </p>
          <div className="login-role-switch" role="tablist" aria-label="Choose login role">
            <button type="button" className={role === 'user' ? 'login-role-option active' : 'login-role-option'} aria-pressed={role === 'user'} onClick={() => handleRoleSelect('user')}>User</button>
            <button type="button" className={role === 'admin' ? 'login-role-option active' : 'login-role-option'} aria-pressed={role === 'admin'} onClick={() => handleRoleSelect('admin')}>Admin</button>
          </div>
          <form className="login-form" onSubmit={(event) => onSubmit(event, savedTechnologies || [])}>
            {mode === 'register' && (
              <>
                <label>
                  <span>Full Name</span>
                  <input name="full_name" type="text" autoComplete="name" placeholder="Your full name" required />
                </label>
                <label>
                  <span>Date of Birth</span>
                  <input name="date_of_birth" type="date" autoComplete="bday" max={latestDateOfBirth} required />
                </label>
                <div className="register-location-grid"><LocationFields /></div>
                <div className="learning-form-summary">
                  <div>
                    <strong>Learning interests</strong>
                    <span>{savedTechnologies ? `${savedTechnologies.length} saved` : 'Required before registration'}</span>
                  </div>
                  <button className="learning-form-button" type="button" onClick={() => setLearningFormOpen(true)}>
                    {savedTechnologies ? 'Edit' : 'Choose'}
                  </button>
                </div>
                {!savedTechnologies?.length && (
                  <p className="learning-required-message" id="learning-required-message" role="status">
                    Save at least one learning interest before creating your account.
                  </p>
                )}
              </>
            )}
            <label htmlFor="login-email">Email address</label>
            <input id="login-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
            <label htmlFor="login-password">{mode === 'register' ? 'Create password' : 'Password'}</label>
            <input id="login-password" name="password" type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} placeholder="Enter your password" minLength={8} required />
            <button
              className="login-submit"
              type="submit"
              aria-describedby={mode === 'register' && !savedTechnologies?.length ? 'learning-required-message' : undefined}
              disabled={signingIn || (mode === 'register' && !savedTechnologies?.length)}
            >
              {signingIn ? 'Please wait' : mode === 'register' ? 'Create user account' : `Sign in as ${role}`} <ArrowRight size={16} />
            </button>
          </form>
          {role === 'user' && (
            <p className="auth-mode-switch">
              {mode === 'register' ? 'Already have an account?' : 'New user?'}
              <button type="button" onClick={() => handleModeChange(mode === 'register' ? 'login' : 'register')}>
                {mode === 'register' ? 'Sign in' : 'Register'}
              </button>
            </p>
          )}
          {message && <p className="login-message" role="status">{message}</p>}
        </section>
      </div>
      {learningFormOpen && (
        <LearningPreferencesDialog
          initialSelection={savedTechnologies || []}
          onSave={saveLearningPreferences}
          onClose={() => setLearningFormOpen(false)}
        />
      )}
    </>
  )
}

export default LoginDialog