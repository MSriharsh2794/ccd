import { ArrowUpRight } from 'lucide-react'
import { featuredStory } from '../features/articles/articleData.js'

function FeaturedStory({ onSelect }) {
  function openStory(event) {
    event.preventDefault()
    onSelect(featuredStory)
  }

  return (
    <section className="featured-story" aria-labelledby="featured-title">
      <div className="featured-copy">
        <div className="story-meta"><span className="tag tag-crimson">Featured · {featuredStory.category}</span><span>{featuredStory.readTime}</span></div>
        <h2 id="featured-title">{featuredStory.title}</h2>
        <p className="featured-excerpt">{featuredStory.excerpt} Explore practical projects, implementation guides, and code repositories that demonstrate how programming, databases, cloud services, and AI can solve real-world problems.</p>
        <div className="featured-byline">
          <div className="author-avatar">CCD</div>
          <div><strong>{featuredStory.author}</strong><span>{featuredStory.date}</span></div>
          <a className="read-story" href="#story" aria-label={`Explore ${featuredStory.title}`} onClick={openStory}>
            <ArrowUpRight size={21} />
          </a>
        </div>
      </div>
      <a className="featured-image" href="#story" aria-label="Explore practical projects" onClick={openStory}>
        <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=85" alt="Circuit board components in a hands-on engineering project" />
        <span className="image-index">01 <span>/</span> PROJECTS</span>
        <span className="image-caption">Connect programming, databases, cloud services, and AI.</span>
      </a>
    </section>
  )
}

export default FeaturedStory