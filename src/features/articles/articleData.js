export const initialArticles = [
  {
    category: 'Software Engineering',
    title: 'The small architecture decisions that save your weekends',
    excerpt: 'A practical guide to boundaries, defaults, and keeping a growing codebase calm.',
    author: 'Maya Chen',
    date: 'Oct 02, 2026',
    readTime: '8 min read',
    image: 'photo-1555066931-4365d14bab8c',
    alt: 'Code open on a laptop screen',
    paragraphs: ['A codebase rarely gets difficult all at once. It gets there through a dozen small decisions that seemed harmless in isolation. Naming the boundary, choosing the boring default, and writing down why can save the next person hours.', 'Good architecture is less about predicting the future than keeping change affordable. Start with the smallest shape that makes the next change easier, then let real use tell you what deserves more structure.'],
  },
  {
    category: 'Cloud Computing',
    title: 'A deployment pipeline you can actually explain',
    excerpt: 'Make every step visible, reversible, and boring in exactly the right way.',
    author: 'Jordan Ellis',
    date: 'Sep 28, 2026',
    readTime: '6 min read',
    image: 'photo-1451187580459-43490279c0fa',
    alt: 'Blue view of Earth from orbit',
    paragraphs: ['A deployment pipeline should tell a clear story: what changed, what was checked, and what happens if something goes wrong. If that story needs a diagram to explain, the pipeline may be doing too much.', 'Keep each step visible and make rollback a first-class path. The best release process is one the whole team can understand before the first incident.'],
  },
  {
    category: 'DevOps & Tools',
    title: 'Make your engineering feedback loop shorter',
    excerpt: 'Small, focused tools can give a team more time to think about the hard parts.',
    author: 'Sam Rivera',
    date: 'Sep 24, 2026',
    readTime: '5 min read',
    image: 'photo-1521737711867-e3b97375f902',
    alt: 'Colleagues collaborating around a table',
    paragraphs: ['A useful command-line tool should shorten the distance between a question and an answer. Keep the interface focused, make failure states clear, and let the tool do one job well.', 'The best developer tools fit naturally into the feedback loop. They give engineers more time to understand the system and less time repeating mechanical work.'],
  },
  {
    category: 'AI & GenAI',
    title: 'Put an AI feature through its engineering review',
    excerpt: 'A practical checklist for usefulness, data boundaries, evaluation, and graceful failure.',
    author: 'Priya Nair',
    date: 'Sep 19, 2026',
    readTime: '7 min read',
    image: 'photo-1677442136019-21780ecad995',
    alt: 'Abstract visualization of artificial intelligence',
    paragraphs: ['A useful AI feature starts with a real task, not a model demo. Decide how success will be evaluated, which data the feature can access, and what a clear fallback looks like when the model is unsure.', 'Treat prompts, retrieval, and output validation as parts of the product contract. The feature earns trust when it stays predictable, explains its limits, and fails without surprising the user.'],
  },
]

export const categories = ['All topics', 'Software Engineering', 'Cloud Computing', 'AI & GenAI', 'DevOps & Tools']
export const defaultArticleImage = 'photo-1497366754035-f200968a6e72'

export const featuredStory = {
  category: 'Practical Projects',
  title: 'Learn by building.',
  excerpt: 'Reading about technology is a starting point. Building something with it is where the concepts come together.',
  author: 'Code Compute Deploy',
  date: 'Project guides',
  readTime: 'Hands-on learning',
  paragraphs: ['Explore practical projects, implementation guides, and code repositories that demonstrate how programming, databases, cloud services, and AI can solve real-world problems.', 'Build a project. Connect the concepts. Put your technology skills into practice.'],
}

export const linkedinArticle = {
  category: 'Editorial Design',
  title: 'Designing long-form content that feels premium, readable, and worth sharing',
  author: 'Alex Liu',
  date: 'Oct 07, 2026',
  readTime: '9 min read',
  coverImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80',
  alt: 'Minimal editorial workspace with laptop, notes, and coffee',
  intro: 'Long-form publishing works when it feels calm, intentional, and easy to read. The best article layouts use large visual breathing room, short paragraphs, and careful hierarchy to guide attention from headline to CTA.',
  quote: 'The strongest article experiences do not compete with the text. They support it.',
  bullets: ['Keep paragraphs short enough for mobile scanning', 'Use subheadings every 200–300 words', 'Break up dense sections with media, quotes, and visual anchors'],
}