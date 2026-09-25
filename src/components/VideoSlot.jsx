import { useEffect, useRef, useState } from 'react'
import { videoBase } from '../content.js'

// Renders <video> for public/videos/<file>. If the file is absent (or fails to
// load) it falls back to a labeled placeholder so the layout stays intact.
// `autoPlay` also mutes and loops the clip (browsers only allow silent autoplay).
// `hoverControls` hides the native controls until the pointer is over the video
// (or it receives focus / a touch), so an autoplaying teaser reads as a banner.
// `loopRange` ([start, end] in seconds; `end` may be null for "to the end of
// the clip") confines playback to that window: the clip starts at `start` and
// jumps back there whenever `end` is reached.
export default function VideoSlot({
  file,
  label,
  poster,
  aspect = '16 / 9',
  autoPlay = false,
  hoverControls = false,
  loopRange = null,
  className = '',
}) {
  const [missing, setMissing] = useState(!file)
  const [revealed, setRevealed] = useState(false)
  const ref = useRef(null)

  // React sets `muted` as a property but never writes the HTML attribute, and
  // some browsers (notably Safari) check the attribute when deciding whether a
  // clip may autoplay. Set it explicitly and kick off playback ourselves.
  useEffect(() => {
    const el = ref.current
    if (!autoPlay || !el) return
    el.muted = true
    el.setAttribute('muted', '')
    const attempt = el.play()
    if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {})
  }, [autoPlay, missing])

  // Loop a sub-range: check on every frame while visible (timeupdate alone
  // only fires a few times a second) and on timeupdate as the background
  // fallback. Rewind once the window's end is reached, and also whenever the
  // position falls before the window (the native loop wrapping to 0, or a
  // scrub), so a window with an open end still restarts at `start`.
  const loopStart = loopRange ? (loopRange[0] ?? 0) : null
  const loopEnd = loopRange ? (loopRange[1] ?? null) : null
  useEffect(() => {
    const el = ref.current
    if (!el || loopStart === null || missing) return undefined
    // Jump a few frames before the true end so the native wrap to 0 never shows.
    const windowEnd = () =>
      loopEnd ?? (Number.isFinite(el.duration) ? el.duration - 0.08 : Number.POSITIVE_INFINITY)
    const rewind = () => {
      const time = el.currentTime
      if (time >= windowEnd() || (time < loopStart - 0.05 && !el.seeking)) {
        el.currentTime = loopStart
        if (el.paused && autoPlay) {
          const attempt = el.play()
          if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {})
        }
      }
    }
    const seekToStart = () => {
      if (el.currentTime < loopStart) el.currentTime = loopStart
    }
    if (el.readyState >= 1) seekToStart()
    else el.addEventListener('loadedmetadata', seekToStart, { once: true })
    let frame = window.requestAnimationFrame(function tick() {
      rewind()
      frame = window.requestAnimationFrame(tick)
    })
    el.addEventListener('timeupdate', rewind)
    return () => {
      window.cancelAnimationFrame(frame)
      el.removeEventListener('timeupdate', rewind)
      el.removeEventListener('loadedmetadata', seekToStart)
    }
  }, [loopStart, loopEnd, autoPlay, missing])

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
      ref={ref}
      className={`video-slot ${className}`.trim()}
      style={{ aspectRatio: aspect }}
      src={`${videoBase}/${file}`}
      poster={poster}
      controls={hoverControls ? revealed : true}
      playsInline
      preload={autoPlay ? 'auto' : 'metadata'}
      autoPlay={autoPlay}
      loop={autoPlay}
      muted={autoPlay}
      aria-label={label}
      tabIndex={hoverControls ? 0 : undefined}
      onMouseEnter={hoverControls ? () => setRevealed(true) : undefined}
      onMouseLeave={hoverControls ? () => setRevealed(false) : undefined}
      onFocus={hoverControls ? () => setRevealed(true) : undefined}
      onBlur={hoverControls ? () => setRevealed(false) : undefined}
      onTouchStart={hoverControls ? () => setRevealed(true) : undefined}
      onError={() => setMissing(true)}
    />
  )
}
