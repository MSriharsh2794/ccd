import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowUpRight, Check, FileText, FileUp, RotateCcw, Sparkles, X } from 'lucide-react'

const acceptedExtensions = ['pdf', 'doc', 'docx']
const acceptedTypes = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

function getExtension(fileName) {
  return fileName.split('.').pop()?.toLowerCase() || ''
}

function formatFileSize(size) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function CVMakerPage() {
  const inputRef = useRef(null)
  const [selection, setSelection] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const file = selection?.file || null
  const fileUrl = selection?.url || ''

  useEffect(() => {
    if (!selection?.url) return undefined
    return () => URL.revokeObjectURL(selection.url)
  }, [selection])

  function selectFile(nextFile) {
    if (!nextFile) return
    if (!acceptedExtensions.includes(getExtension(nextFile.name))) {
      setError('Choose a PDF, DOC, or DOCX file.')
      return
    }
    if (nextFile.size > 20 * 1024 * 1024) {
      setError('Choose a file smaller than 20 MB.')
      return
    }
    setSelection({ file: nextFile, url: URL.createObjectURL(nextFile) })
    setError('')
  }

  function handleDrop(event) {
    event.preventDefault()
    setDragging(false)
    selectFile(event.dataTransfer.files?.[0])
  }

  function clearFile() {
    setSelection(null)
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <main className="cv-maker-page">
      <header className="cv-maker-header">
        <a className="cv-maker-back" href="/"><ArrowLeft size={17} /> Back to CCD</a>
        <a className="cv-maker-brand" href="/" aria-label="Code Compute Deploy home">
          <span className="brand-logo-frame" aria-hidden="true"><img className="brand-logo" src="/CCD.jpeg" alt="" /></span>
          <span><strong>Code Compute Deploy</strong><small>CAREER WORKSPACE</small></span>
        </a>
        <span className="cv-maker-header-status"><span /> PRIVATE WORKSPACE</span>
      </header>

      <div className="cv-maker-layout">
        <section className="cv-maker-upload-column" aria-labelledby="cv-maker-title">
          <div className="cv-maker-heading">
            <p className="cv-maker-kicker"><span>01</span> START WITH YOUR CV</p>
            <h1 id="cv-maker-title">Make your next move <em>count.</em></h1>
            <p>Bring your current CV into your workspace. You can review your file before continuing.</p>
          </div>

          <div className="cv-upload-section">
            <div className="cv-upload-section-title">
              <div><span className="cv-step-number">01</span><div><h2>Upload your CV</h2><p>Start with the version you have today.</p></div></div>
              {file && <span className="cv-ready-badge"><Check size={13} /> FILE READY</span>}
            </div>

            {file ? (
              <div className="cv-selected-file">
                <span className="cv-file-icon"><FileText size={21} /></span>
                <div className="cv-file-copy"><strong title={file.name}>{file.name}</strong><span>{getExtension(file.name).toUpperCase()} · {formatFileSize(file.size)}</span></div>
                <button className="cv-remove-file" type="button" onClick={clearFile} aria-label="Remove selected CV" title="Remove file"><X size={17} /></button>
              </div>
            ) : (
              <button
                className={dragging ? 'cv-drop-zone dragging' : 'cv-drop-zone'}
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                aria-label="Choose or drop your CV file"
              >
                <span className="cv-upload-symbol"><FileUp size={24} /></span>
                <strong>Drop your CV here</strong>
                <span>or <u>browse files</u> on your device</span>
                <small>PDF, DOC, or DOCX <i /> UP TO 20 MB</small>
              </button>
            )}
                <input ref={inputRef} className="cv-hidden-input" type="file" accept={acceptedTypes} onChange={(event) => selectFile(event.target.files?.[0])} />
            {error && <p className="cv-upload-error" role="alert">{error}</p>}

            <div className="cv-privacy-note"><span className="cv-privacy-lock" aria-hidden="true">+</span><p><strong>Your file stays yours.</strong><br />This preview is local to your browser. Your CV is not uploaded to a server.</p></div>
          </div>

          {file && (
            <div className="cv-next-step">
              <div><span className="cv-next-indicator"><Sparkles size={16} /></span><div><strong>Ready for your next step</strong><span>Your document is loaded in the preview.</span></div></div>
              <button type="button" disabled aria-label="Continue to CV editing">Continue <ArrowUpRight size={15} /></button>
            </div>
          )}

          <a className="cv-home-link" href="/"><RotateCcw size={14} /> Return to the learning library</a>
        </section>

        <section className="cv-maker-preview-column" aria-labelledby="cv-preview-title">
          <div className="cv-preview-topline"><span>DOCUMENT PREVIEW</span><span>{file ? 'LOCAL VIEW' : 'YOUR WORKSPACE'}</span></div>
          <div className={file ? 'cv-preview-canvas has-file' : 'cv-preview-canvas'}>
            {file && fileUrl && getExtension(file.name) === 'pdf' ? (
              <iframe className="cv-pdf-frame" src={fileUrl} title={`Preview of ${file.name}`} />
            ) : file ? (
              <div className="cv-word-preview">
                <span className="cv-word-icon">W</span>
                <h2>Your Word document is ready</h2>
                <p>Word files are selected locally. An in-browser document preview will be added in a later step.</p>
                <div className="cv-word-file"><FileText size={17} /><span>{file.name}</span><span>{formatFileSize(file.size)}</span></div>
              </div>
            ) : (
              <div className="cv-empty-preview">
                <div className="cv-paper-stack" aria-hidden="true"><span /><span /><span><i /><i /><i /><i /><i /></span></div>
                <p className="cv-preview-label">YOUR SPACE, YOUR STORY</p>
                <h2>Your next chapter<br />starts here.</h2>
                <p className="cv-preview-copy">Upload a CV to see it here. Your original file stays unchanged while you explore what comes next.</p>
                <div className="cv-preview-footer"><span>01</span><span>DOCUMENT WORKSPACE</span><span>CCD</span></div>
              </div>
            )}
          </div>
          <div className="cv-preview-caption"><span><span className="cv-caption-dot" /> {file ? 'Previewing selected file' : 'Waiting for your document'}</span><span>CV STUDIO <ArrowUpRight size={12} /></span></div>
        </section>
      </div>
    </main>
  )
}

export default CVMakerPage
