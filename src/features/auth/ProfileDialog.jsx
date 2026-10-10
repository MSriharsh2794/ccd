import { X } from 'lucide-react'

function ProfileDialog({ user, onClose }) {
  const profile = user.user_metadata || {}
  const fields = [
    ['Full name', profile.full_name],
    ['Date of birth', profile.date_of_birth],
    ['City', profile.city],
    ['Country', profile.country],
  ]

  return (
    <div className="story-backdrop" onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="login-dialog profile-dialog" role="dialog" aria-modal="true" aria-labelledby="profile-title">
        <button className="story-close" type="button" aria-label="Close profile" autoFocus onClick={onClose}><X size={19} /></button>
        <p className="eyebrow"><span className="eyebrow-line" /> User profile</p>
        <h2 id="profile-title">{profile.full_name || 'Your profile'}</h2>
        <dl className="profile-details">
          <div><dt>Email id</dt><dd>{user.email || 'Not provided'}</dd></div>
          {fields.map(([label, value]) => (
            <div key={label}><dt>{label}</dt><dd>{value || 'Not provided'}</dd></div>
          ))}
          <div className="profile-technologies">
            <dt>Technologies to learn</dt>
            <dd>{profile.technologies?.length ? profile.technologies.join(', ') : 'Not provided'}</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}

export default ProfileDialog