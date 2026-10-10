import { useRef, useState } from 'react'
import { ArrowRight, Bold, Code2, Heading2, ImagePlus, Italic, Link, List, ListOrdered, Minus, Quote, X } from 'lucide-react'

function ArticleFormDialog({
  articleForm,
  articleFormError,
  onClose,
  onInput,
  onImageUpload,
  onBodyChange,
  onSubmit,
}) {
  const editorRef = useRef(null)
  const inlineImageInputRef = useRef(null)
  const [initialBody] = useState(articleForm.content)

  function runCommand(command, value) {
    editorRef.current?.focus()
    document.execCommand(command, false, value)
    onBodyChange(editorRef.current?.innerHTML || '')
  }

  function insertLink() {
    const url = window.prompt('Enter a link URL')
    if (url) runCommand('createLink', url)
  }

  function insertInlineImage(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      editorRef.current?.focus()
      document.execCommand('insertImage', false, String(reader.result || ''))
      onBodyChange(editorRef.current?.innerHTML || '')
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  return (
    <div className="story-backdrop" onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="article-form-dialog" role="dialog" aria-modal="true" aria-labelledby="article-form-title">
        <button className="story-close" type="button" aria-label="Close article form" autoFocus onClick={onClose}><X size={19} /></button>
        <p className="eyebrow"><span className="eyebrow-line" /> Publish article</p>
        <h2 id="article-form-title">Write a new article</h2>
        <form className="article-form" onSubmit={onSubmit}>
          {articleFormError && <p className="article-form-error" role="status">{articleFormError}</p>}
          <div className="article-cover-area">
            {articleForm.imagePreview ? (
              articleForm.mediaType === 'video'
                ? <video className="article-cover-preview" controls src={articleForm.imagePreview}>Your browser does not support video playback.</video>
                : <img className="article-cover-preview" src={articleForm.imagePreview} alt="Article cover preview" />
            ) : (
              <div className="article-cover-empty"><ImagePlus size={31} /><span>Add a cover image or video to your article.</span></div>
            )}
            <label className="article-cover-upload">
              <input type="file" accept="image/*,video/*" onChange={onImageUpload} />
              {articleForm.imagePreview ? 'Replace cover media' : 'Upload from computer'}
            </label>
          </div>
          <input className="article-title-input" name="title" value={articleForm.title} onChange={onInput} placeholder="Title" aria-label="Article title" required />
          <div className="article-rich-editor">
            <div className="article-editor-toolbar" role="toolbar" aria-label="Article formatting">
              <select aria-label="Text style" defaultValue="p" onMouseDown={(event) => event.preventDefault()} onChange={(event) => runCommand('formatBlock', `<${event.target.value}>`)}>
                <option value="p">Paragraph</option><option value="h2">Heading</option><option value="h3">Subheading</option>
              </select>
              <button type="button" aria-label="Bold" title="Bold" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand('bold')}><Bold size={18} /></button>
              <button type="button" aria-label="Italic" title="Italic" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand('italic')}><Italic size={18} /></button>
              <button type="button" aria-label="Bulleted list" title="Bulleted list" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand('insertUnorderedList')}><List size={18} /></button>
              <button type="button" aria-label="Numbered list" title="Numbered list" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand('insertOrderedList')}><ListOrdered size={18} /></button>
              <button type="button" aria-label="Quote" title="Quote" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand('formatBlock', '<blockquote>')}><Quote size={18} /></button>
              <button type="button" aria-label="Code block" title="Code block" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand('formatBlock', '<pre>')}><Code2 size={18} /></button>
              <button type="button" aria-label="Insert divider" title="Insert divider" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand('insertHorizontalRule')}><Minus size={18} /></button>
              <button type="button" aria-label="Add link" title="Add link" onMouseDown={(event) => event.preventDefault()} onClick={insertLink}><Link size={18} /></button>
              <button type="button" aria-label="Insert image" title="Insert image" onMouseDown={(event) => event.preventDefault()} onClick={() => inlineImageInputRef.current?.click()}><ImagePlus size={18} /></button>
              <input ref={inlineImageInputRef} className="article-inline-image-input" type="file" accept="image/*" onChange={insertInlineImage} tabIndex="-1" aria-label="Choose inline image" />
            </div>
            <div
              ref={editorRef}
              className="article-rich-content"
              contentEditable
              suppressContentEditableWarning
              role="textbox"
              aria-label="Article body"
              aria-multiline="true"
              data-placeholder="Write your article here..."
              dangerouslySetInnerHTML={{ __html: initialBody }}
              onInput={(event) => onBodyChange(event.currentTarget.innerHTML)}
            />
          </div>
          <details className="article-publishing-details">
            <summary><Heading2 size={16} /> Publishing details</summary>
            <div className="article-form-grid">
              <label>
                <span>Category</span>
                <select name="category" value={articleForm.category} onChange={onInput}>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="AI & GenAI">AI &amp; GenAI</option>
                  <option value="DevOps & Tools">DevOps &amp; Tools</option>
                </select>
              </label>
              <label><span>Reading time</span><input name="readTime" value={articleForm.readTime} onChange={onInput} placeholder="4 min read" /></label>
              <label><span>Author</span><input name="author" value={articleForm.author} onChange={onInput} placeholder="Your name" /></label>
            </div>
            <label><span>Excerpt</span><textarea name="excerpt" value={articleForm.excerpt} onChange={onInput} placeholder="Short summary for the preview" rows="3" /></label>
          </details>
          <button className="login-submit article-publish-button" type="submit">Publish article <ArrowRight size={16} /></button>
        </form>
      </section>
    </div>
  )
}

export default ArticleFormDialog