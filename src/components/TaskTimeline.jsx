import { useEffect, useId, useState } from 'react'
import {
  capabilities,
  capabilityState,
  controllers,
  imgBase,
  methods,
  skills,
  tasks,
  trialsPerTask,
} from '../content.js'

const AUTOPLAY_MS = 3200

function Marker({ state }) {
  if (state === 'acquired') {
    return (
      <svg className="tl-marker is-acquired" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M10 1.5 L18.5 10 L10 18.5 L1.5 10 Z" />
      </svg>
    )
  }
  if (state === 'used') {
    return (
      <svg className="tl-marker is-used" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="6" />
      </svg>
    )
  }
  return null
}

const stateLabel = {
  acquired: 'acquired here',
  used: 'used',
  retained: 'retained in library',
  absent: 'not yet available',
}

function CapabilityRow({ capability, selected, onSelect }) {
  return (
    <>
      <div className="tl-row-label">
        <code>{capability.id}</code>
      </div>
      {tasks.map((task, position) => {
        const state = capabilityState(capability, position)
        const prev = position > 0 ? capabilityState(capability, position - 1) : 'absent'
        const next = position < tasks.length - 1 ? capabilityState(capability, position + 1) : 'absent'
        const exists = state !== 'absent'
        const lineLeft = exists && prev !== 'absent'
        const lineRight = exists && next !== 'absent'
        const classes = ['tl-cell', position === selected ? 'is-selected' : '']
        return (
          <button
            key={task.id}
            type="button"
            className={classes.join(' ').trim()}
            onClick={() => onSelect(position)}
            title={`${capability.id}: ${stateLabel[state]} at ${task.id}`}
            aria-label={`${capability.id} ${stateLabel[state]} at ${task.id}`}
          >
            {lineLeft ? <span className="tl-line is-left" aria-hidden="true" /> : null}
            {lineRight ? <span className="tl-line is-right" aria-hidden="true" /> : null}
            <Marker state={state} />
          </button>
        )
      })}
    </>
  )
}

function SuccessRow({ method, selected, onSelect }) {
  return (
    <>
      <div className="tl-row-label is-method">
        <span className="tl-swatch" style={{ background: `var(${method.colorVar})` }} aria-hidden="true" />
        <span>{method.label}</span>
      </div>
      {tasks.map((task, position) => {
        const successes = task.success[method.id]
        const rate = Math.round((100 * successes) / trialsPerTask)
        const classes = [
          'tl-cell',
          'is-rate',
          method.id === 'elevate' ? 'is-ours' : '',
          position === selected ? 'is-selected' : '',
        ]
        return (
          <button
            key={task.id}
            type="button"
            className={classes.join(' ').trim()}
            onClick={() => onSelect(position)}
            title={`${method.label} on ${task.id}: ${successes}/${trialsPerTask}`}
          >
            <span className="tl-rate">{rate}%</span>
            <span className="tl-rate-bar" aria-hidden="true">
              <span style={{ width: `${rate}%`, background: `var(${method.colorVar})` }} />
            </span>
          </button>
        )
      })}
    </>
  )
}

function LibraryChips({ items, position }) {
  return (
    <ul className="tl-chips">
      {items.map((capability) => {
        const state = capabilityState(capability, position)
        if (state === 'absent') return null
        return (
          <li key={capability.id} className={`tl-chip is-${state}`} title={capability.summary}>
            <Marker state={state === 'retained' ? 'none' : state} />
            <code>{capability.id}</code>
          </li>
        )
      })}
    </ul>
  )
}

export default function TaskTimeline() {
  const [selected, setSelected] = useState(1)
  const [isPlaying, setIsPlaying] = useState(true)
  const detailId = useId()

  useEffect(() => {
    if (!isPlaying) return undefined
    const timerId = window.setInterval(() => {
      setSelected((current) => (current + 1) % tasks.length)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(timerId)
  }, [isPlaying])

  useEffect(() => {
    tasks.forEach((task) => {
      const image = new window.Image()
      image.src = `${imgBase}/tasks/${task.id}.png`
    })
  }, [])

  const select = (position) => {
    setIsPlaying(false)
    setSelected(position)
  }

  const step = (delta) => select((selected + delta + tasks.length) % tasks.length)

  const task = tasks[selected]
  const acquiredHere = capabilities.filter((capability) => task.usage[capability.id] === 'acquired')
  const controllerCount = controllers.filter((c) => capabilityState(c, selected) !== 'absent').length

  return (
    <figure className="timeline">
      <div className="timeline-controls">
        <button
          className="tl-play-button"
          type="button"
          aria-label={isPlaying ? 'Stop stepping through tasks' : 'Step through tasks automatically'}
          aria-pressed={isPlaying}
          onClick={() => setIsPlaying((value) => !value)}
        >
          <span className={isPlaying ? 'tl-stop-icon' : 'tl-play-icon'} aria-hidden="true" />
        </button>
        <button className="tl-step-button" type="button" onClick={() => step(-1)} aria-label="Previous task">
          ‹
        </button>
        <span className="tl-position" aria-live="polite">
          Task {selected + 1} of {tasks.length} · library: {controllerCount}{' '}
          {controllerCount === 1 ? 'controller' : 'controllers'}
        </span>
        <button className="tl-step-button" type="button" onClick={() => step(1)} aria-label="Next task">
          ›
        </button>
        <ul className="tl-legend" aria-label="Legend">
          <li>
            <Marker state="acquired" /> Acquired here
          </li>
          <li>
            <Marker state="used" /> Reused
          </li>
          <li>
            <span className="tl-legend-line" aria-hidden="true" /> Retained in library
          </li>
        </ul>
      </div>

      <div className="timeline-scroll">
        <div
          className="timeline-grid"
          role="group"
          aria-label="Seven-task sequence with capability acquisition and reuse"
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') {
              event.preventDefault()
              step(1)
            } else if (event.key === 'ArrowLeft') {
              event.preventDefault()
              step(-1)
            }
          }}
        >
          <div className="tl-row-label is-obs">Task observations</div>
          <div className="tl-obs" style={{ gridColumn: '2 / span 4' }}>
            Ground-truth target pose provided
          </div>
          <div className="tl-obs is-visual" style={{ gridColumn: '6 / span 3' }}>
            Visual target localization only
          </div>
          <div className="tl-row-label is-header">
            <span className="tl-family">Task</span>
          </div>
          {tasks.map((item, position) => {
            const isActive = position === selected
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={detailId}
                className={`tl-task${isActive ? ' is-active' : ''}`}
                onClick={() => select(position)}
              >
                <img
                  src={`${imgBase}/tasks/${item.id}.png`}
                  alt={`${item.id}: ${item.objective}`}
                  loading="eager"
                />
                <span className="tl-task-id">{item.id}</span>
                <span className="tl-task-short">{item.short}</span>
              </button>
            )
          })}

          <div className="tl-band" style={{ gridColumn: '1 / -1' }}>
            <span>Learned controllers</span>
            <span className="tl-band-note">Trained with RL. The agent adds three to the initial one.</span>
          </div>
          {controllers.map((capability) => (
            <CapabilityRow key={capability.id} capability={capability} selected={selected} onSelect={select} />
          ))}

          <div className="tl-band is-skills" style={{ gridColumn: '1 / -1' }}>
            <span>High-level skills</span>
            <span className="tl-band-note">Python programs written by the agent that coordinate controllers.</span>
          </div>
          {skills.map((capability) => (
            <CapabilityRow key={capability.id} capability={capability} selected={selected} onSelect={select} />
          ))}

          <div className="tl-band is-rates" style={{ gridColumn: '1 / -1' }}>
            <span>Success rate</span>
            <span className="tl-band-note">50 evaluation variants per task, final program of each method.</span>
          </div>
          {methods.map((method) => (
            <SuccessRow key={method.id} method={method} selected={selected} onSelect={select} />
          ))}
        </div>
      </div>

      <div className="timeline-detail" id={detailId} role="tabpanel">
        <img className="tl-detail-thumb" src={`${imgBase}/tasks/${task.id}.png`} alt="" />
        <div className="tl-detail-body">
          <p className="tl-detail-kicker">
            {task.id} · {task.family}
          </p>
          <h3 className="tl-detail-title">{task.objective}</h3>
          <p className="tl-detail-story">{task.story}</p>
          <p className="tl-detail-note">{task.note}</p>
          <div className="tl-detail-library">
            <div>
              <p className="tl-detail-label">
                Controllers after {task.id}
                {acquiredHere.some((c) => c.kind === 'controller') ? (
                  <span className="tl-detail-badge">new</span>
                ) : null}
              </p>
              <LibraryChips items={controllers} position={selected} />
            </div>
            <div>
              <p className="tl-detail-label">
                Skills after {task.id}
                {acquiredHere.some((c) => c.kind === 'skill') ? <span className="tl-detail-badge">new</span> : null}
              </p>
              <LibraryChips items={skills} position={selected} />
            </div>
          </div>
        </div>
        <div className="tl-detail-rates" aria-label={`Success rates on ${task.id}`}>
          {methods.map((method) => {
            const successes = task.success[method.id]
            const rate = Math.round((100 * successes) / trialsPerTask)
            return (
              <div className="tl-detail-rate" key={method.id}>
                <span className="tl-detail-rate-label">
                  <span className="tl-swatch" style={{ background: `var(${method.colorVar})` }} aria-hidden="true" />
                  {method.label}
                </span>
                <span className="tl-detail-rate-track" aria-hidden="true">
                  <span style={{ width: `${rate}%`, background: `var(${method.colorVar})` }} />
                </span>
                <span className="tl-detail-rate-value">
                  {rate}% <small>({successes}/{trialsPerTask})</small>
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </figure>
  )
}
