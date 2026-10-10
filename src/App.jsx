import { useEffect, useState } from 'react'
import { ArrowRight, Eye } from 'lucide-react'
import SiteHeader from './components/SiteHeader.jsx'
import SiteIntro from './components/SiteIntro.jsx'
import FeaturedStory from './components/FeaturedStory.jsx'
import EditorialShowcase from './components/EditorialShowcase.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import ArticleLibrary from './features/articles/ArticleLibrary.jsx'
import ArticleFormDialog from './features/articles/ArticleFormDialog.jsx'
import StoryDialog from './features/articles/StoryDialog.jsx'
import { useArticles } from './features/articles/useArticles.js'
import LoginDialog from './features/auth/LoginDialog.jsx'
import ProfileDialog from './features/auth/ProfileDialog.jsx'
import { useAuthentication } from './features/auth/useAuthentication.js'
import AdminWorkspace from './features/admin/AdminWorkspace.jsx'
import PublicVideoLibrary from './features/admin/PublicVideoLibrary.jsx'
import CVMakerPage from './features/cv-maker/CVMakerPage.jsx'
import './App.css'

function App() {
  const {
    articles,
    articleForm,
    articleFormError,
    handleArticleInput,
    handleArticleBodyChange,
    handleImageUpload,
    submitArticle,
  } = useArticles()
  const {
    loginOpen,
    profileOpen,
    selectedRole,
    authMode,
    message,
    authLoading,
    signingIn,
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
  } = useAuthentication()
  const [activeCategory, setActiveCategory] = useState('All topics')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [selectedStory, setSelectedStory] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [articleFormOpen, setArticleFormOpen] = useState(false)
  const isAdminRoute = window.location.pathname.replace(/\/$/, '') === '/admin'
  const isCVMakerRoute = window.location.pathname.replace(/\/$/, '') === '/cv-maker'
  const previewAsUser = new URLSearchParams(window.location.search).get('preview') === 'user'

  useEffect(() => {
    if (!selectedStory && !loginOpen && !profileOpen && !articleFormOpen) return undefined

    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setSelectedStory(null)
        closeLogin()
        closeProfile()
        setArticleFormOpen(false)
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [selectedStory, loginOpen, profileOpen, articleFormOpen, closeLogin, closeProfile])

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

  function publishArticle(event) {
    submitArticle(event, (article) => {
      if (!isAdminRoute) setSelectedStory(article)
      setArticleFormOpen(false)
    })
  }

  function openAdminLogin() {
    openLogin()
    selectRole('admin')
  }

  if (isCVMakerRoute) return <CVMakerPage />

  if (isAdminRoute) {
    return (
      <>
        {isAdmin ? (
          <AdminWorkspace user={user} articles={articles} onWriteArticle={() => setArticleFormOpen(true)} onSignOut={signOut} />
        ) : (
          <main className="admin-access-page">
            <div className="admin-access-panel">
              <p className="admin-overline">CODE COMPUTE DEPLOY</p>
              <h1>Administrator access</h1>
              <p>{authLoading ? 'Checking your administrator session...' : 'This workspace is reserved for the configured administrator account.'}</p>
              {!authLoading && <button className="admin-primary-button" type="button" onClick={openAdminLogin}>Sign in as admin</button>}
              <a href="/">Return to the public site</a>
            </div>
          </main>
        )}
        {articleFormOpen && isAdmin && (
          <ArticleFormDialog
            articleForm={articleForm}
            articleFormError={articleFormError}
            onClose={() => setArticleFormOpen(false)}
            onInput={handleArticleInput}
            onImageUpload={handleImageUpload}
            onBodyChange={handleArticleBodyChange}
            onSubmit={publishArticle}
          />
        )}
        {loginOpen && (
          <LoginDialog
            role={selectedRole}
            mode={authMode}
            message={message}
            signingIn={signingIn}
            onRoleSelect={selectRole}
            onModeChange={changeAuthMode}
            onClose={closeLogin}
            onSubmit={submitAuth}
          />
        )}
      </>
    )
  }

  return (
    <div className="site-shell">
      {previewAsUser && (
        <div className="user-preview-banner">
          <span><Eye size={15} /> USER PREVIEW</span>
          <a href="/admin">Return to admin workspace <ArrowRight size={14} /></a>
        </div>
      )}
      <SiteHeader
        setActiveCategory={setActiveCategory}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        user={previewAsUser ? null : user}
        authLoading={previewAsUser ? false : authLoading}
        openLogin={openLogin}
        openProfile={openProfile}
        signOut={signOut}
        isAdmin={isAdmin && !previewAsUser}
      />
      <main id="top">
        <SiteIntro />
        <FeaturedStory onSelect={setSelectedStory} />
        <EditorialShowcase />
        <PublicVideoLibrary />
        <ArticleLibrary
          articles={filteredArticles}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onSelectStory={setSelectedStory}
          subscribed={subscribed}
          onSubscribe={handleSubscribe}
        />
      </main>
      <SiteFooter />

      {articleFormOpen && isAdmin && (
        <ArticleFormDialog
          articleForm={articleForm}
          articleFormError={articleFormError}
          onClose={() => setArticleFormOpen(false)}
          onInput={handleArticleInput}
          onImageUpload={handleImageUpload}
          onBodyChange={handleArticleBodyChange}
          onSubmit={publishArticle}
        />
      )}
      {selectedStory && <StoryDialog story={selectedStory} onClose={() => setSelectedStory(null)} />}
      {profileOpen && user && <ProfileDialog user={user} onClose={closeProfile} />}
      {loginOpen && (
        <LoginDialog
          role={selectedRole}
          mode={authMode}
          message={message}
          signingIn={signingIn}
          onRoleSelect={selectRole}
          onModeChange={changeAuthMode}
          onClose={closeLogin}
          onSubmit={submitAuth}
        />
      )}
    </div>
  )
}

export default App
