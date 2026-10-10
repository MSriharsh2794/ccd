import { ArrowRight } from 'lucide-react'
import { linkedinArticle } from '../features/articles/articleData.js'

function EditorialShowcase() {
  return (
    <section className="editorial-showcase" aria-labelledby="editorial-title">
      <div className="editorial-heading">
        <p className="eyebrow"><span className="eyebrow-line" /> About Code Compute Deploy</p>
        <h2 id="editorial-title">Technology makes more sense when you build with it.</h2>
      </div>
      <article className="linkedin-article">
        <img className="article-cover" src={linkedinArticle.coverImage} alt={linkedinArticle.alt} />
        <div className="article-meta-row">
          <span className="tag tag-crimson">Practical learning</span>
          <span>Learn · Build · Deploy</span>
          <span>Our approach</span>
        </div>
        <h3 className="article-headline">Learning should go beyond theory.</h3>
        <div className="article-author-row">
          <div className="author-avatar">CCD</div>
          <div><strong>Code Compute Deploy</strong><span>A practical technology learning platform</span></div>
        </div>
        <div className="article-body">
          <p>Code Compute Deploy is built around a simple idea: learning should go beyond theory. We explain technical concepts in plain language, explore how technologies work together, and help developers apply their knowledge through practical examples and projects.</p>
          <p>From writing efficient SQL queries to building cloud-powered applications, our focus is on understanding the technology behind the code.</p>
          <h4>Code</h4>
          <p>Learn programming, SQL, databases, APIs, and software engineering fundamentals.</p>
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" alt="Developers collaborating on a practical technology project" />
          <h4>Compute</h4>
          <p>Explore cloud infrastructure, Microsoft Azure, artificial intelligence, and modern computing technologies.</p>
          <blockquote>Learn how these areas connect to turn ideas into working software.</blockquote>
          <h4>Deploy</h4>
          <p>Understand Git, CI/CD, Docker, Kubernetes, automation, and application deployment.</p>
          <ul>
            <li>Follow practical implementation guides and code repositories.</li>
            <li>Connect programming, databases, cloud services, and AI.</li>
            <li>Build projects that solve real-world problems.</li>
          </ul>
          <div className="article-cta">
            <span>Learn by building</span>
            <a href="#articles">Explore practical tutorials <ArrowRight size={15} /></a>
          </div>
        </div>
      </article>
    </section>
  )
}

export default EditorialShowcase