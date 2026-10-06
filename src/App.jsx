import { useEffect, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, LogIn, Menu, Search, X } from 'lucide-react'
import './App.css'

const articles = [
  {
    category: 'Software Engineering',
    title: 'The small architecture decisions that save your weekends',
    excerpt: 'A practical guide to boundaries, defaults, and keeping a growing codebase calm.',
    author: 'Maya Chen',
    date: 'Oct 02, 2026',
    readTime: '8 min read',
    image: 'photo-1555066931-4365d14bab8c',
    alt: 'Code open on a laptop screen',
    paragraphs: ['A codebase rarely gets difficult all at once. It gets there through a dozen small decisions that seemed harmless in isolation. Naming the boundary, choosing the boring default, and writing down why can save the next person hours.', 'Good architecture is less about predicting the future than keeping change affordable. Start with the smallest shape that makes the next change easier, then let real use tell you what deserves more structure.'],
  },
  {
    category: 'Cloud Computing',
    title: 'A deployment pipeline you can actually explain',
    excerpt: 'Make every step visible, reversible, and boring in exactly the right way.',
    author: 'Jordan Ellis',
    date: 'Sep 28, 2026',
    readTime: '6 min read',
    image: 'photo-1451187580459-43490279c0fa',
    alt: 'Blue view of Earth from orbit',
    paragraphs: ['A deployment pipeline should tell a clear story: what changed, what was checked, and what happens if something goes wrong. If that story needs a diagram to explain, the pipeline may be doing too much.', 'Keep each step visible and make rollback a first-class path. The best release process is one the whole team can understand before the first incident.'],
  },
  {
    category: 'DevOps & Tools',
    title: 'Make your engineering feedback loop shorter',
    excerpt: 'Small, focused tools can give a team more time to think about the hard parts.',
    author: 'Sam Rivera',
    date: 'Sep 24, 2026',
    readTime: '5 min read',
    image: 'photo-1521737711867-e3b97375f902',
    alt: 'Colleagues collaborating around a table',
    paragraphs: ['A useful command-line tool should shorten the distance between a question and an answer. Keep the interface focused, make failure states clear, and let the tool do one job well.', 'The best developer tools fit naturally into the feedback loop. They give engineers more time to understand the system and less time repeating mechanical work.'],
  },
  {
    category: 'AI & GenAI',
    title: 'Put an AI feature through its engineering review',
    excerpt: 'A practical checklist for usefulness, data boundaries, evaluation, and graceful failure.',
    author: 'Priya Nair',
    date: 'Sep 19, 2026',
    readTime: '7 min read',
    image: 'photo-1677442136019-21780ecad995',
    alt: 'Abstract visualization of artificial intelligence',
    paragraphs: ['A useful AI feature starts with a real task, not a model demo. Decide how success will be evaluated, which data the feature can access, and what a clear fallback looks like when the model is unsure.', 'Treat prompts, retrieval, and output validation as parts of the product contract. The feature earns trust when it stays predictable, explains its limits, and fails without surprising the user.'],
  },
]

const categories = ['All topics', 'Software Engineering', 'Cloud Computing', 'AI & GenAI', 'DevOps & Tools']
const featuredStory = {
  category: 'Cloud Computing',
  title: 'Cloud computing, without the black box.',
  excerpt: "A good idea isn't done when it runs on your machine. It's done when someone else can use it, trust it, and build on it.",
  author: 'Alex Liu',
  date: 'Oct 06, 2026',
  readTime: '9 min read',
  paragraphs: ['Cloud infrastructure can feel opaque until you can trace how an idea becomes a running service. Start with the fundamentals: where compute runs, how requests move, and which parts of the system own state.', 'When the architecture is visible, tradeoffs become easier to explain. Build a deployment path that is observable and reversible, and keep the people using the platform in view after launch day.'],
}

function App() {
  const [activeCategory, setActiveCategory] = useState('All topics')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [selectedStory, setSelectedStory] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [loginMessage, setLoginMessage] = useState('')

  useEffect(() => {
    if (!selectedStory && !loginOpen) return undefined

    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setSelectedStory(null)
        setLoginOpen(false)
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [selectedStory, loginOpen])

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = activeCategory === 'All topics' || article.category === activeCategory
    const query = searchQuery.trim().toLowerCase()
    const matchesSearch = !query || `${article.title} ${article.excerpt} ${article.category}`.toLowerCase().includes(query)

    return matchesCategory && matchesSearch
  })

  function handleSubscribe(event) {
    event.preventDefault()
    setSubscribed(true)
  }

  function handleLogin(event) {
    event.preventDefault()
    setLoginMessage('Sign-in is not connected yet.')
  }

  return (
    <div className="site-shell">
      <div className="announcement">
        <span className="announcement-dot" aria-hidden="true" />
        <span>Modern Engineering · Cloud · AI</span>
        <a href="#articles">Explore articles <ArrowRight size={14} /></a>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Code Compute Deploy home">
          <span className="brand-logo-frame" aria-hidden="true"><img className="brand-logo" src="/CCD.jpeg" alt="" /></span>
          <span className="brand-name"><b>Code Compute Deploy</b><small>Build. Learn. Engineer.</small></span>
        </a>
        <nav className={menuOpen ? 'main-nav open' : 'main-nav'} id="main-navigation" aria-label="Main navigation">
          <a href="#articles" onClick={() => setMenuOpen(false)}>Articles</a>
          <a href="#topics" onClick={() => { setActiveCategory('Cloud Computing'); setMenuOpen(false) }}>Cloud</a>
          <a href="#topics" onClick={() => { setActiveCategory('AI & GenAI'); setMenuOpen(false) }}>AI &amp; GenAI</a>
          <a href="#topics" onClick={() => { setActiveCategory('DevOps & Tools'); setMenuOpen(false) }}>Developer Tools</a>
          <a href="#newsletter" onClick={() => setMenuOpen(false)}>Learning</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          {searchOpen && (
            <input
              className="search-input"
              type="search"
              placeholder="Search stories"
              aria-label="Search stories"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          )}
          <button
            className="icon-button search-button"
            type="button"
            aria-label={searchOpen ? 'Close search' : 'Search stories'}
            aria-pressed={searchOpen}
            onClick={() => {
              setSearchOpen(!searchOpen)
              setSearchQuery('')
            }}
          >
            <Search size={18} strokeWidth={1.8} />
          </button>
          <button className="login-button" type="button" onClick={() => { setLoginMessage(''); setLoginOpen(true) }}>
            <LogIn size={15} /> Log in
          </button>
          <a className="subscribe-link" href="#newsletter">Get the digest <ArrowUpRight size={15} /></a>
        </div>
      </header>

      <main id="top">
        <section className="intro" id="about">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" /> Build. Learn. Engineer.</p>
            <h1>Build. Compute.<br /><span>Deploy.</span></h1>
          </div>
          <div className="intro-aside">
            <p>Empowering developers to code smarter, compute faster, and deploy confidently.</p>
            <a href="#articles">Explore the engineering world <ArrowDown size={15} /></a>
            <div className="code-example">
              <span>CODE EXAMPLE</span>
              <code><b>const</b> platform = <i>"CCD"</i>;<br /><b>console</b>.log(platform);</code>
            </div>
          </div>
        </section>

        <section className="featured-story" aria-labelledby="featured-title">
          <div className="featured-copy">
            <div className="story-meta"><span className="tag tag-crimson">Featured · Cloud Computing</span><span>9 min read</span></div>
            <h2 id="featured-title">Cloud computing, without the black box.</h2>
            <p className="featured-excerpt">A good idea isn't done when it runs on your machine. It's done when someone else can use it, trust it, and build on it.</p>
            <div className="featured-byline">
              <div className="author-avatar">AL</div>
              <div><strong>Alex Liu</strong><span>Oct 06, 2026</span></div>
              <a className="read-story" href="#story" aria-label="Read Cloud computing, without the black box" onClick={(event) => { event.preventDefault(); setSelectedStory(featuredStory) }}>
                <ArrowUpRight size={21} />
              </a>
            </div>
          </div>
          <a className="featured-image" href="#story" aria-label="Read the featured story" onClick={(event) => { event.preventDefault(); setSelectedStory(featuredStory) }}>
            <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=85" alt="Intricate green circuit board components" />
            <span className="image-index">01 <span>/</span> FEATURED</span>
            <span className="image-caption">Understand the architecture behind modern platforms.</span>
          </a>
        </section>

        <section className="journal-section" id="articles">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><span className="eyebrow-line" /> Learn by building</p>
              <h2>Explore the engineering world<span>.</span></h2>
            </div>
            <a className="all-articles" href="#topics">Browse topics <ArrowRight size={16} /></a>
          </div>

          <div className="journal-layout">
            <div className="article-column">
              <div className="topic-tabs" id="topics" role="group" aria-label="Filter stories by topic">
                {categories.map((category) => (
                  <button
                    className={activeCategory === category ? 'topic-tab active' : 'topic-tab'}
                    key={category}
                    type="button"
                    aria-pressed={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {filteredArticles.length > 0 ? (
                <div className="article-list">
                  {filteredArticles.map((article, index) => (
                    <article className="article-card" key={article.title}>
                      <div className="article-image" aria-hidden="true">
                        <img src={`https://images.unsplash.com/${article.image}?auto=format&fit=crop&w=700&q=80`} alt={article.alt} />
                        <span>{String(index + 1).padStart(2, '0')}</span>
                      </div>
                      <div className="article-content">
                        <div className="article-kicker"><span>{article.category}</span><span>{article.readTime}</span></div>
                        <h3><a href="#story" onClick={(event) => { event.preventDefault(); setSelectedStory(article) }}>{article.title}</a></h3>
                        <p>{article.excerpt}</p>
                        <div className="article-footer"><span>{article.author}</span><span>{article.date}</span></div>
                      </div>
                      <a className="article-arrow" href="#story" aria-label={`Read ${article.title}`} onClick={(event) => { event.preventDefault(); setSelectedStory(article) }}><ArrowUpRight size={18} /></a>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No stories found. Try a different topic or search.</p>
              )}
            </div>

            <aside className="sidebar">
              <section className="newsletter" id="newsletter">
                <span className="newsletter-mark" aria-hidden="true">&gt;_</span>
                <p className="eyebrow">CCD field notes</p>
                <h3>Build your<br />next skill.</h3>
                <p className="newsletter-copy">Practical engineering insights, cloud guides, and AI explainers. Delivered Fridays.</p>
                {subscribed ? (
                  <p className="success-message" role="status">You're on the list. See you Friday.</p>
                ) : (
                  <form className="newsletter-form" onSubmit={handleSubscribe}>
                    <label className="visually-hidden" htmlFor="email-address">Your email address</label>
                    <input id="email-address" type="email" placeholder="you@somewhere.dev" required />
                    <button type="submit" aria-label="Subscribe to the newsletter"><ArrowRight size={18} /></button>
                  </form>
                )}
                <span className="subscriber-note">Join 2,400+ curious engineers</span>
              </section>
              <section className="popular-topics">
                <p className="eyebrow">Explore topics</p>
                <button type="button" onClick={() => setActiveCategory('Software Engineering')}>Software Engineering <span>12</span></button>
                <button type="button" onClick={() => setActiveCategory('Cloud Computing')}>Cloud Computing <span>08</span></button>
                <button type="button" onClick={() => setActiveCategory('AI & GenAI')}>AI &amp; GenAI <span>06</span></button>
              </section>
            </aside>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand" href="#top"><span className="brand-logo-frame" aria-hidden="true"><img className="brand-logo" src="/CCD.jpeg" alt="" /></span><span className="brand-name"><b>Code Compute Deploy</b><small>Build. Learn. Engineer.</small></span></a>
        <span>Engineering the next generation of software.</span>
        <a href="#top">Back to top ↑</a>
      </footer>

      {selectedStory && (
        <div className="story-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setSelectedStory(null) }}>
          <article className="story-dialog" role="dialog" aria-modal="true" aria-labelledby="story-title">
            <button className="story-close" type="button" aria-label="Close story" autoFocus onClick={() => setSelectedStory(null)}><X size={19} /></button>
            <p className="eyebrow"><span className="eyebrow-line" /> {selectedStory.category} <span>{selectedStory.readTime}</span></p>
            <h2 id="story-title">{selectedStory.title}</h2>
            <p className="story-deck">{selectedStory.excerpt}</p>
            <p className="story-byline">By {selectedStory.author} <span>{selectedStory.date}</span></p>
            <div className="story-body">
              {selectedStory.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </article>
        </div>
      )}

      {loginOpen && (
        <div className="story-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setLoginOpen(false) }}>
          <section className="login-dialog" role="dialog" aria-modal="true" aria-labelledby="login-title">
            <button className="story-close" type="button" aria-label="Close login" autoFocus onClick={() => setLoginOpen(false)}><X size={19} /></button>
            <p className="eyebrow"><span className="eyebrow-line" /> CCD account</p>
            <h2 id="login-title">Welcome back.</h2>
            <p className="login-copy">Sign in to continue learning with Code Compute Deploy.</p>
            <form className="login-form" onSubmit={handleLogin}>
              <label htmlFor="login-email">Email address</label>
              <input id="login-email" type="email" autoComplete="email" placeholder="you@example.com" required />
              <label htmlFor="login-password">Password</label>
              <input id="login-password" type="password" autoComplete="current-password" placeholder="Enter your password" required />
              <button className="login-submit" type="submit">Sign in <ArrowRight size={16} /></button>
            </form>
            {loginMessage && <p className="login-message" role="status">{loginMessage}</p>}
          </section>
        </div>
      )}
    </div>
  )
}

export default App
