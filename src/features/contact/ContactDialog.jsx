import { useEffect, useState } from 'react'
import { ArrowRight, Mail, X } from 'lucide-react'

const contactEmail = 'codecomputedeploy@gmail.com'

function ContactDialog({ onClose }) {
  const [notice, setNotice] = useState('')

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') || '').trim()
    const email = String(form.get('email') || '').trim()
    const subject = String(form.get('subject') || '').trim() || 'Website question'
    const question = String(form.get('question') || '').trim()
    const body = [`From: ${name}`, `Reply to: ${email}`, '', question].join('\n')
    const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setNotice('Your email app should open with your question ready. Review it there and press Send.')
    window.location.href = mailtoUrl
  }

  return (
    <div className="story-backdrop contact-backdrop" onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="contact-dialog" role="dialog" aria-modal="true" aria-labelledby="contact-title">
        <button className="story-close" type="button" aria-label="Close contact form" onClick={onClose}><X size={19} /></button>
        <p className="eyebrow"><span className="eyebrow-line" /> CONTACT CODE COMPUTE DEPLOY</p>
        <h2 id="contact-title">What would you like to ask?</h2>
        <p className="contact-intro">Send a question, share feedback, or suggest a topic for a future guide.</p>
        <a className="contact-email-link" href={`mailto:${contactEmail}`}><Mail size={15} /> {contactEmail}</a>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form-grid">
            <label><span>Your name</span><input name="name" autoComplete="name" required /></label>
            <label><span>Your email</span><input name="email" type="email" autoComplete="email" required /></label>
          </div>
          <label><span>Subject</span><input name="subject" defaultValue="Website question" required /></label>
          <label><span>Your question</span><textarea name="question" rows="5" placeholder="Tell us what you would like to know..." required /></label>
          <p className="contact-privacy-note">Your message is prepared in your email app; this website does not store contact submissions.</p>
          {notice && <p className="contact-notice" role="status">{notice}</p>}
          <button className="login-submit contact-submit" type="submit">Continue to email <ArrowRight size={16} /></button>
        </form>
      </section>
    </div>
  )
}

export default ContactDialog
