import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { categories } from './articleData.js'
import { getArticleImageSrc } from './useArticles.js'
import NewsletterSignup from '../newsletter/NewsletterSignup.jsx'

function ArticleLibrary({ articles, activeCategory, setActiveCategory, onSelectStory, subscribed, onSubscribe }) {
  return (
    <section className="journal-section" id="articles">
      <div className="section-heading">
        <div>
          <p className="eyebrow"><span className="eyebrow-line" /> Articles and learning resources</p>
          <h2>Understand the technology behind the tools<span>.</span></h2>
          <p className="section-description">Explore practical tutorials, technical explainers, engineering best practices, and cloud learning guides designed to make complex topics easier to understand. Whether you are strengthening your fundamentals or exploring a new technology, find resources that help you learn with purpose.</p>
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
          {articles.length > 0 ? (
            <div className="article-list">
              {articles.map((article, index) => (
                <article className="article-card" key={article.title}>
                  <div className="article-image" aria-hidden="true">
                    {article.coverType === 'video' && article.video
                      ? <video src={article.video} muted playsInline preload="metadata" />
                      : <img src={getArticleImageSrc(article.image)} alt={article.alt} />}
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="article-content">
                    <div className="article-kicker"><span>{article.category}</span><span>{article.readTime}</span></div>
                    <h3><a href="#story" onClick={(event) => { event.preventDefault(); onSelectStory(article) }}>{article.title}</a></h3>
                    <p>{article.excerpt}</p>
                    <div className="article-footer"><span>{article.author}</span><span>{article.date}</span></div>
                  </div>
                  <a className="article-arrow" href="#story" aria-label={`Read ${article.title}`} onClick={(event) => { event.preventDefault(); onSelectStory(article) }}><ArrowUpRight size={18} /></a>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty-state">No stories found. Try a different topic or search.</p>
          )}
        </div>
        <aside className="sidebar">
          <NewsletterSignup subscribed={subscribed} onSubscribe={onSubscribe} />
          <section className="popular-topics">
            <p className="eyebrow">Explore topics</p>
            <button type="button" onClick={() => setActiveCategory('Software Engineering')}>Software Engineering <span>12</span></button>
            <button type="button" onClick={() => setActiveCategory('Cloud Computing')}>Cloud Computing <span>08</span></button>
            <button type="button" onClick={() => setActiveCategory('AI & GenAI')}>AI &amp; GenAI <span>06</span></button>
          </section>
        </aside>
      </div>
    </section>
  )
}

export default ArticleLibrary