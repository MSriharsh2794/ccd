import { useEffect, useState } from 'react'
import {
  ArrowUpRight,
  BookOpen,
  Download,
  Eye,
  FileText,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Plus,
  Trash2,
  Video,
  X,
} from 'lucide-react'
import { deleteAdminContent, loadAdminContent, saveAdminContent } from './adminContentStore.js'

const sections = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'articles', label: 'Articles', icon: BookOpen },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'notes', label: 'Quick notes', icon: Lightbulb },
  { id: 'paths', label: 'Learning paths', icon: ArrowUpRight },
  { id: 'videos', label: 'Videos', icon: Video },
]

const sectionLabels = Object.fromEntries(sections.map(({ id, label }) => [id, label]))

function AdminWorkspace({ user, articles, onWriteArticle, onSignOut }) {
  const [activeSection, setActiveSection] = useState('overview')
  const [entries, setEntries] = useState([])
  const [ready, setReady] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    let active = true
    loadAdminContent()
      .then((savedEntries) => {
        if (active) setEntries(savedEntries.sort((left, right) => right.createdAt - left.createdAt))
      })
      .catch(() => {
        if (active) setFormError('Workspace storage is unavailable in this browser.')
      })
      .finally(() => {
        if (active) setReady(true)
      })
    return () => { active = false }
  }, [])

  const visibleEntries = activeSection === 'overview'
    ? entries.slice(0, 5)
    : entries.filter((entry) => entry.type === activeSection)

  useEffect(() => {
    if (!formOpen) return undefined
    function closeOnEscape(event) {
      if (event.key === 'Escape') setFormOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [formOpen])

  function openCreateForm() {
    setFormError('')
    setFormOpen(true)
  }

  async function handleCreate(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const title = String(data.get('title') || '').trim()
    const summary = String(data.get('summary') || '').trim()
    const text = String(data.get('text') || '').trim()
    const file = data.get('file')
    const videoUrl = String(data.get('videoUrl') || '').trim()

    if (!title) {
      setFormError('Add a title before saving.')
      return
    }
    if (activeSection === 'documents' && !(file instanceof File && file.size)) {
      setFormError('Choose a document to upload.')
      return
    }
    if (activeSection === 'videos' && !(videoUrl || (file instanceof File && file.size))) {
      setFormError('Add a video URL or upload a video file.')
      return
    }

    const entry = {
      id: crypto.randomUUID(),
      type: activeSection,
      title,
      summary: summary || text,
      text,
      level: String(data.get('level') || ''),
      steps: String(data.get('steps') || '').split('\n').map((step) => step.trim()).filter(Boolean),
      videoUrl,
      file: file instanceof File && file.size ? file : null,
      createdAt: Date.now(),
    }

    try {
      await saveAdminContent(entry)
      setEntries((current) => [entry, ...current])
      setFormOpen(false)
      setNotice(`${sectionLabels[activeSection].replace(/s$/, '')} saved to this workspace.`)
      window.setTimeout(() => setNotice(''), 3500)
    } catch {
      setFormError('Could not save this item. Check available browser storage and try again.')
    }
  }

  async function handleDelete(entry) {
    try {
      await deleteAdminContent(entry.id)
      setEntries((current) => current.filter((item) => item.id !== entry.id))
    } catch {
      setFormError('Could not remove this item. Please try again.')
    }
  }

  function handleDownload(entry) {
    const downloadUrl = URL.createObjectURL(entry.file)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = entry.file.name
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0)
  }

  function renderCreateFields() {
    return (
      <>
        <label className="admin-field">
          <span>Title</span>
          <input name="title" placeholder={`Name this ${sectionLabels[activeSection].toLowerCase()}`} required />
        </label>
        {(activeSection === 'documents' || activeSection === 'videos') && (
          <label className="admin-field">
            <span>Description</span>
            <textarea name="summary" rows="3" placeholder="A short description" />
          </label>
        )}
        {activeSection === 'documents' && (
          <label className="admin-field">
            <span>Document file</span>
            <input name="file" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md" required />
          </label>
        )}
        {activeSection === 'notes' && (
          <label className="admin-field">
            <span>Note</span>
            <textarea name="text" rows="7" placeholder="Capture an idea or reminder" required />
          </label>
        )}
        {activeSection === 'paths' && (
          <>
            <label className="admin-field">
              <span>Summary</span>
              <textarea name="summary" rows="3" placeholder="What learners will be able to do" required />
            </label>
            <label className="admin-field">
              <span>Level</span>
              <select name="level" defaultValue="Foundational">
                <option>Foundational</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </label>
            <label className="admin-field">
              <span>Learning steps</span>
              <textarea name="steps" rows="6" placeholder={'One step per line\nCloud fundamentals\nDeploy a first service'} required />
            </label>
          </>
        )}
        {activeSection === 'videos' && (
          <>
            <label className="admin-field">
              <span>Video URL</span>
              <input name="videoUrl" type="url" placeholder="https://..." />
            </label>
            <label className="admin-field">
              <span>Or upload a video</span>
              <input name="file" type="file" accept="video/*" />
            </label>
          </>
        )}
      </>
    )
  }

  function renderEntry(entry) {
    return (
      <article className="admin-entry" key={entry.id}>
        <div className="admin-entry-type">{sectionLabels[entry.type]}</div>
        <div className="admin-entry-copy">
          <h3>{entry.title}</h3>
          <p>{entry.summary || entry.text || (entry.steps.length ? `${entry.steps.length} learning steps` : 'No description added.')}</p>
          <div className="admin-entry-meta">
            <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
            {entry.level && <span>{entry.level}</span>}
            {entry.file && <span>{entry.file.name}</span>}
          </div>
          {entry.file && (
            <button className="admin-entry-download" type="button" onClick={() => handleDownload(entry)}>
              <Download size={14} /> Download {entry.type === 'videos' ? 'video' : 'file'}
            </button>
          )}
          {entry.videoUrl && <a className="admin-entry-download" href={entry.videoUrl} target="_blank" rel="noreferrer">Open video <ArrowUpRight size={14} /></a>}
          {entry.steps.length > 0 && <ol className="admin-path-steps">{entry.steps.map((step, index) => <li key={`${entry.id}-${index}`}>{step}</li>)}</ol>}
        </div>
        <button className="admin-icon-button" type="button" aria-label={`Delete ${entry.title}`} onClick={() => handleDelete(entry)}>
          <Trash2 size={16} />
        </button>
      </article>
    )
  }

  return (
    <div className="admin-portal">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/" aria-label="Code Compute Deploy home">
          <img src="/CCD.jpeg" alt="" />
          <span><strong>CCD</strong><small>CONTENT STUDIO</small></span>
        </a>
        <p className="admin-nav-label">WORKSPACE</p>
        <nav className="admin-nav" aria-label="Admin workspace">
          {sections.map(({ id, label, icon: Icon }) => (
            <button key={id} className={activeSection === id ? 'admin-nav-item active' : 'admin-nav-item'} type="button" aria-current={activeSection === id ? 'page' : undefined} onClick={() => { setActiveSection(id); setFormError('') }}>
              <Icon size={17} /> {label}
              {id === 'articles' && <span>{articles.length}</span>}
              {id !== 'overview' && id !== 'articles' && <span>{entries.filter((entry) => entry.type === id).length}</span>}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <span className="admin-local-label"><span /> Local workspace storage</span>
          <a href="/?preview=user"><Eye size={15} /> Preview as user <ArrowUpRight size={15} /></a>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div><span className="admin-breadcrumb">CCD / WORKSPACE</span><strong>{sectionLabels[activeSection]}</strong></div>
          <div className="admin-account">
            <span className="admin-account-email">{user.email}</span>
            <button className="admin-signout" type="button" onClick={onSignOut}><LogOut size={15} /> Sign out</button>
          </div>
        </header>

        <section className="admin-content">
          <div className="admin-page-heading">
            <div>
              <p className="admin-overline">CONTENT OPERATIONS</p>
              <h1>{activeSection === 'overview' ? 'Your publishing desk' : sectionLabels[activeSection]}</h1>
              <p className="admin-heading-copy">{activeSection === 'overview' ? 'Draft, organize, and publish learning resources.' : `Manage ${sectionLabels[activeSection].toLowerCase()} for Code Compute Deploy.`}</p>
            </div>
            {activeSection !== 'overview' && activeSection !== 'articles' && (
              <button className="admin-primary-button" type="button" onClick={openCreateForm}><Plus size={17} /> Add {sectionLabels[activeSection].replace(/s$/, '').toLowerCase()}</button>
            )}
            {activeSection === 'articles' && (
              <button className="admin-primary-button" type="button" onClick={onWriteArticle}><Plus size={17} /> Write article</button>
            )}
          </div>

          {activeSection === 'overview' && (
            <div className="admin-overview-stats">
              <div><span>Published articles</span><strong>{articles.length}</strong><small>Available in the public library</small></div>
              <div><span>Workspace resources</span><strong>{entries.length}</strong><small>Saved in this browser</small></div>
              <div><span>Last updated</span><strong>{entries[0] ? new Date(entries[0].createdAt).toLocaleDateString() : '—'}</strong><small>{entries[0]?.title || 'No resources yet'}</small></div>
            </div>
          )}

          <section className="admin-library-section">
            <div className="admin-section-heading">
              <div><h2>{activeSection === 'overview' ? 'Recent activity' : activeSection === 'articles' ? 'Published articles' : 'Saved resources'}</h2><span>{activeSection === 'articles' ? `${articles.length} articles` : `${visibleEntries.length} items`}</span></div>
              {activeSection === 'overview' && <button type="button" className="admin-text-button" onClick={() => setActiveSection('articles')}>View articles <ArrowUpRight size={15} /></button>}
            </div>

            {activeSection === 'articles' ? (
              articles.length ? articles.map((article) => (
                <article className="admin-entry" key={`${article.title}-${article.date}`}>
                  <div className="admin-entry-type">Article</div>
                  <div className="admin-entry-copy"><h3>{article.title}</h3><p>{article.excerpt}</p><div className="admin-entry-meta"><span>{article.category}</span><span>{article.date}</span><span>{article.author}</span></div></div>
                  <span className="admin-published-status">Published</span>
                </article>
              )) : <p className="admin-empty-state">No articles yet. Start with a practical guide or project walkthrough.</p>
            ) : ready ? (
              visibleEntries.length ? visibleEntries.map(renderEntry) : <p className="admin-empty-state">Nothing here yet. Add a resource to build your library.</p>
            ) : <p className="admin-empty-state">Loading workspace...</p>}
          </section>
          <p className="admin-storage-note">Supporting resources and uploaded files are stored in this browser only. Public article publishing uses the site’s current browser-local article store.</p>
          {notice && <p className="admin-notice" role="status">{notice}</p>}
          {formError && !formOpen && <p className="admin-error" role="status">{formError}</p>}
        </section>
      </main>

      {formOpen && (
        <div className="admin-modal-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setFormOpen(false) }}>
          <section className="admin-create-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-create-title">
            <button className="admin-icon-button admin-modal-close" type="button" aria-label="Close form" onClick={() => setFormOpen(false)}><X size={16} /></button>
            <p className="admin-overline">NEW RESOURCE</p>
            <h2 id="admin-create-title">Add {sectionLabels[activeSection].replace(/s$/, '').toLowerCase()}</h2>
            <form onSubmit={handleCreate}>
              {renderCreateFields()}
              {formError && <p className="admin-error" role="status">{formError}</p>}
              <button className="admin-primary-button" type="submit"><Plus size={16} /> Save to workspace</button>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default AdminWorkspace