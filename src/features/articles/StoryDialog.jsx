import { X } from 'lucide-react'
import DOMPurify from 'dompurify'

function renderStoryParagraph(paragraph, index) {
  const imagePattern = /!\[(.*?)\]\((.*?)\)/g
  const matches = [...paragraph.matchAll(imagePattern)]
  if (!matches.length) return <p key={`${paragraph}-${index}`}>{paragraph}</p>

  const nodes = []
  let lastIndex = 0
  matches.forEach((match, matchIndex) => {
    const [fullMatch, altText, imageSrc] = match
    const textBefore = paragraph.slice(lastIndex, match.index)
    if (textBefore) nodes.push(<span key={`text-${index}-${matchIndex}`}>{textBefore}</span>)
    nodes.push(<img key={`image-${index}-${matchIndex}`} className="story-inline-image" src={imageSrc} alt={altText || 'Article illustration'} />)
    lastIndex = match.index + fullMatch.length
  })
  if (lastIndex < paragraph.length) nodes.push(<span key={`tail-${index}`}>{paragraph.slice(lastIndex)}</span>)

  return <div className="story-paragraph-media" key={`${paragraph}-${index}`}>{nodes}</div>
}

function StoryDialog({ story, onClose }) {
  return (
    <div className="story-backdrop" onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <article className="story-dialog" role="dialog" aria-modal="true" aria-labelledby="story-title">
        <button className="story-close" type="button" aria-label="Close story" autoFocus onClick={onClose}><X size={19} /></button>
        <p className="eyebrow"><span className="eyebrow-line" /> {story.category} <span>{story.readTime}</span></p>
        <h2 id="story-title">{story.title}</h2>
        <p className="story-deck">{story.excerpt}</p>
        {story.coverType === 'video' && story.video && (
          <video className="story-cover-video" controls playsInline src={story.video}>Your browser does not support video playback.</video>
        )}
        {story.coverType !== 'video' && story.image && story.image.startsWith('data:') && (
          <img className="story-cover-image" src={story.image} alt={story.alt || ''} />
        )}
        <p className="story-byline">By {story.author} <span>{story.date}</span></p>
        {story.contentHtml ? (
          <div className="story-body story-rich-body" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(story.contentHtml) }} />
        ) : (
          <div className="story-body">{story.paragraphs.map(renderStoryParagraph)}</div>
        )}
      </article>
    </div>
  )
}

export default StoryDialog