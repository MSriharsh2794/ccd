import { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'
import { defaultArticleImage, initialArticles } from './articleData.js'

const emptyArticleForm = {
  title: '',
  category: 'Software Engineering',
  author: 'User Author',
  excerpt: '',
  readTime: '4 min read',
  content: '',
  imagePreview: '',
  mediaType: 'image',
}

export function useArticles() {
  const [articles, setArticles] = useState(() => {
    const savedArticles = localStorage.getItem('ccd-articles')
    return savedArticles ? JSON.parse(savedArticles) : initialArticles
  })
  const [articleForm, setArticleForm] = useState(emptyArticleForm)
  const [articleFormError, setArticleFormError] = useState('')

  useEffect(() => {
    localStorage.setItem('ccd-articles', JSON.stringify(articles))
  }, [articles])

  function handleArticleInput(event) {
    const { name, value } = event.target
    setArticleForm((current) => ({ ...current, [name]: value }))
  }

  function handleArticleBodyChange(content) {
    setArticleForm((current) => ({ ...current, content }))
  }

  function readImage(file, onLoad) {
    const reader = new FileReader()
    reader.onload = () => onLoad(String(reader.result || ''))
    reader.readAsDataURL(file)
  }

  function handleImageUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return

    readImage(file, (imagePreview) => {
      setArticleForm((current) => ({
        ...current,
        imagePreview,
        mediaType: file.type.startsWith('video/') ? 'video' : 'image',
      }))
    })
    event.target.value = ''
  }

  function submitArticle(event, onPublished) {
    event.preventDefault()

    const title = articleForm.title.trim()
    const contentHtml = DOMPurify.sanitize(articleForm.content)
    const parsedContent = new DOMParser().parseFromString(contentHtml, 'text/html').body
    const content = Array.from(parsedContent.children)
      .map((element) => element.textContent.trim())
      .filter(Boolean)
      .join('\n\n')
    const excerpt = articleForm.excerpt.trim() || `${content.slice(0, 110)}${content.length > 110 ? '…' : ''}`

    if (!title || !content) {
      setArticleFormError('Please add both a title and article content.')
      return
    }

    const paragraphs = content.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean)
    const newArticle = {
      category: articleForm.category,
      title,
      excerpt,
      author: articleForm.author.trim() || 'User Author',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: articleForm.readTime || '4 min read',
      image: articleForm.mediaType === 'image' ? articleForm.imagePreview || defaultArticleImage : defaultArticleImage,
      video: articleForm.mediaType === 'video' ? articleForm.imagePreview : '',
      coverType: articleForm.mediaType,
      alt: `${title} article cover`,
      contentHtml,
      paragraphs: paragraphs.length > 0 ? paragraphs : ['This article was published from the site editor.'],
    }

    setArticleFormError('')
    setArticles((currentArticles) => [newArticle, ...currentArticles])
    setArticleForm(emptyArticleForm)
    onPublished(newArticle)
  }

  return {
    articles,
    setArticles,
    articleForm,
    articleFormError,
    handleArticleInput,
    handleArticleBodyChange,
    handleImageUpload,
    submitArticle,
  }
}

export function getArticleImageSrc(image) {
  if (!image) return `https://images.unsplash.com/${defaultArticleImage}?auto=format&fit=crop&w=700&q=80`
  if (image.startsWith('data:') || image.startsWith('http')) return image
  return `https://images.unsplash.com/${image}?auto=format&fit=crop&w=700&q=80`
}