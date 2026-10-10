import { useEffect, useState } from 'react'
import { ArrowUpRight, Play } from 'lucide-react'
import { loadAdminContent } from './adminContentStore.js'

function PublicVideoLibrary() {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    let active = true
    const objectUrls = []

    loadAdminContent()
      .then((entries) => {
        if (!active) return
        const publishedVideos = entries
          .filter((entry) => entry.type === 'videos')
          .sort((left, right) => right.createdAt - left.createdAt)
          .map((entry) => {
            if (!entry.file) return entry
            const mediaUrl = URL.createObjectURL(entry.file)
            objectUrls.push(mediaUrl)
            return { ...entry, mediaUrl }
          })
        setVideos(publishedVideos)
      })
      .catch(() => {})

    return () => {
      active = false
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  if (!videos.length) return null

  return (
    <section className="public-videos-section" aria-labelledby="public-videos-title">
      <div className="public-videos-heading">
        <div>
          <p className="eyebrow"><span className="eyebrow-line" /> Watch and learn</p>
          <h2 id="public-videos-title">Video library<span>.</span></h2>
        </div>
        <span className="public-video-count">{videos.length} {videos.length === 1 ? 'video' : 'videos'}</span>
      </div>
      <div className="public-video-grid">
        {videos.map((video) => (
          <article className="public-video-card" key={video.id}>
            {video.mediaUrl ? (
              <video className="public-video-player" controls playsInline preload="metadata" src={video.mediaUrl}>
                Your browser does not support video playback.
              </video>
            ) : (
              <a className="public-video-link" href={video.videoUrl} target="_blank" rel="noreferrer">
                <Play size={23} fill="currentColor" /> Watch video <ArrowUpRight size={17} />
              </a>
            )}
            <div className="public-video-copy">
              <h3>{video.title}</h3>
              {video.summary && <p>{video.summary}</p>}
              {video.file && <span>{video.file.name}</span>}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default PublicVideoLibrary