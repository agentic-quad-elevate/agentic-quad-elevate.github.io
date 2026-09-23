import { useId, useState } from 'react'
import { imgBase, realExperiments } from '../content.js'
import VideoSlot from './VideoSlot.jsx'

// Segmented tabs that show one real-robot experiment (video + storyboard + caption) at a time.
export default function RealExperiments() {
  const [activeId, setActiveId] = useState(realExperiments[0].id)
  const baseId = useId()
  const active = realExperiments.find((experiment) => experiment.id === activeId)

  function onKeyDown(event) {
    const index = realExperiments.findIndex((experiment) => experiment.id === activeId)
    let next = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % realExperiments.length
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + realExperiments.length) % realExperiments.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = realExperiments.length - 1
    if (next === null) return
    event.preventDefault()
    const target = realExperiments[next]
    setActiveId(target.id)
    document.getElementById(`${baseId}-tab-${target.id}`)?.focus()
  }

  return (
    <div className="real-switcher">
      <div className="real-tabs" role="tablist" aria-label="Real-robot experiments" onKeyDown={onKeyDown}>
        {realExperiments.map((experiment) => {
          const selected = experiment.id === activeId
          return (
            <button
              key={experiment.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${experiment.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${experiment.id}`}
              tabIndex={selected ? 0 : -1}
              className={`real-tab${selected ? ' is-active' : ''}`}
              onClick={() => setActiveId(experiment.id)}
            >
              <span className="real-tab-code">{experiment.code}</span>
              <span>{experiment.title}</span>
              <span className="real-score">{experiment.score}</span>
            </button>
          )
        })}
      </div>

      <figure
        key={active.id}
        className="real-item"
        role="tabpanel"
        id={`${baseId}-panel-${active.id}`}
        aria-labelledby={`${baseId}-tab-${active.id}`}
      >
        <VideoSlot file={active.video} label={active.videoLabel} autoPlay hoverControls />
        <img src={`${imgBase}/${active.storyboard}`} alt={active.storyboardAlt} />
        <figcaption>{active.caption}</figcaption>
      </figure>
    </div>
  )
}
