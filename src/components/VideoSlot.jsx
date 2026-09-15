import { useState } from 'react'
import { videoBase } from '../content.js'

// Renders <video> for public/videos/<file>. If the file is absent (or fails to
// load) it falls back to a labeled placeholder so the layout stays intact.
export default function VideoSlot({ file, label, poster, aspect = '16 / 9', autoPlay = false, className = '' }) {
  const [missing, setMissing] = useState(!file)

  if (missing) {
    return (
      <div className={`video-slot is-placeholder ${className}`.trim()} style={{ aspectRatio: aspect }} role="img" aria-label={`${label} (video coming soon)`}>
        <span className="video-slot-icon" aria-hidden="true">
          <i className="fas fa-video"></i>
        </span>
        <span className="video-slot-label">{label}</span>
        <span className="video-slot-hint">Video coming soon</span>
      </div>
    )
  }

  return (
    <video
      className={`video-slot ${className}`.trim()}
      style={{ aspectRatio: aspect }}
      src={`${videoBase}/${file}`}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      autoPlay={autoPlay}
      loop={autoPlay}
      muted={autoPlay}
      aria-label={label}
      onError={() => setMissing(true)}
    />
  )
}
