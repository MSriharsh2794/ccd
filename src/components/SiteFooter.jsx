import { useState } from 'react'
import { Mail, MessageCircleQuestion } from 'lucide-react'
import ContactDialog from '../features/contact/ContactDialog.jsx'

function SiteFooter() {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <>
      <footer className="site-footer" id="contact">
        <a className="brand" href="#top">
          <span className="brand-logo-frame" aria-hidden="true"><img className="brand-logo" src="/CCD.jpeg" alt="" /></span>
          <span className="brand-name"><b>Code Compute Deploy</b><small>Learn. Build. Deploy.</small></span>
        </a>
        <span>Learn a new concept. Build a project. Keep moving forward.</span>
        <div className="site-footer-contact">
          <a className="site-footer-email" href="mailto:codecomputedeploy@gmail.com"><Mail size={14} /> codecomputedeploy@gmail.com</a>
          <button type="button" onClick={() => setContactOpen(true)}><MessageCircleQuestion size={15} /> Ask a question</button>
        </div>
        <a href="#top">Back to top ↑</a>
      </footer>
      {contactOpen && <ContactDialog onClose={() => setContactOpen(false)} />}
    </>
  )
}

export default SiteFooter