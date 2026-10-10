import { ArrowRight, LayoutDashboard, Menu, Search, X } from 'lucide-react'
import AuthControls from '../features/auth/AuthControls.jsx'

function SiteHeader({
  setActiveCategory,
  menuOpen,
  setMenuOpen,
  searchOpen,
  setSearchOpen,
  searchQuery,
  setSearchQuery,
  user,
  authLoading,
  openLogin,
  openProfile,
  signOut,
  isAdmin,
}) {
  return (
    <>
      <div className="announcement">
        <span className="announcement-dot" aria-hidden="true" />
        <span>Modern Engineering · Cloud · AI</span>
        <a href="#articles">Explore articles <ArrowRight size={14} /></a>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Code Compute Deploy home">
          <span className="brand-logo-frame" aria-hidden="true"><img className="brand-logo" src="/CCD.jpeg" alt="" /></span>
          <span className="brand-name"><b>Code Compute Deploy</b><small>Learn. Build. Deploy.</small></span>
        </a>
        <nav className={menuOpen ? 'main-nav open' : 'main-nav'} id="main-navigation" aria-label="Main navigation">
          <a href="#articles" onClick={() => setMenuOpen(false)}>Articles</a>
          <a href="#topics" onClick={() => { setActiveCategory('Cloud Computing'); setMenuOpen(false) }}>Cloud</a>
          <a href="#topics" onClick={() => { setActiveCategory('AI & GenAI'); setMenuOpen(false) }}>AI &amp; GenAI</a>
          <a href="#topics" onClick={() => { setActiveCategory('DevOps & Tools'); setMenuOpen(false) }}>Developer Tools</a>
          <a href="/cv-maker" onClick={() => setMenuOpen(false)}>CV Maker</a>
          <a href="#newsletter" onClick={() => setMenuOpen(false)}>Learning</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
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
          <AuthControls user={user} isLoading={authLoading} onLogin={openLogin} onProfile={openProfile} onSignOut={signOut} />
          {isAdmin && (
            <a className="add-article-button" href="/admin">
              <LayoutDashboard size={15} /> Admin workspace
            </a>
          )}
        </div>
      </header>
    </>
  )
}

export default SiteHeader