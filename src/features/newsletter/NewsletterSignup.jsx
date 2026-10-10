import { ArrowRight } from 'lucide-react'

function NewsletterSignup({ subscribed, onSubscribe }) {
  return (
    <section className="newsletter" id="newsletter">
      <span className="newsletter-mark" aria-hidden="true">&gt;_</span>
      <p className="eyebrow">CCD field notes</p>
      <h3>Your next step starts here.</h3>
      <p className="newsletter-copy">Learn a new concept. Build a project. Develop skills you can put into practice.</p>
      {subscribed ? (
        <p className="success-message" role="status">You're on the list. See you Friday.</p>
      ) : (
        <form className="newsletter-form" onSubmit={onSubscribe}>
          <label className="visually-hidden" htmlFor="email-address">Your email address</label>
          <input id="email-address" type="email" placeholder="you@somewhere.dev" required />
          <button type="submit" aria-label="Subscribe to the newsletter"><ArrowRight size={18} /></button>
        </form>
      )}
      <span className="subscriber-note">Explore Code Compute Deploy and keep moving forward in your technology journey.</span>
    </section>
  )
}

export default NewsletterSignup