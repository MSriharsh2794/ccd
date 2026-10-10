import { ArrowDown } from 'lucide-react'

function SiteIntro() {
  return (
    <section className="intro" id="about">
      <div>
        <p className="eyebrow"><span className="eyebrow-line" /> Code Compute Deploy</p>
        <h1>Build. Learn.<br /><span>Engineer.</span></h1>
      </div>
      <div className="intro-aside">
        <p><strong>Turn technical knowledge into practical skills.</strong></p>
        <p>Code Compute Deploy helps developers understand modern technology, build real-world projects, and learn how software moves from code to production.</p>
        <p>Explore software engineering, databases, cloud computing, AI, and DevOps through practical tutorials, technical articles, and hands-on projects.</p>
        <a href="#articles">Explore articles and learning resources <ArrowDown size={15} /></a>
        <div className="code-example">
          <span>LEARN · BUILD · DEPLOY</span>
          <code>Software engineering · SQL<br />Azure · AI · DevOps</code>
        </div>
      </div>
    </section>
  )
}

export default SiteIntro