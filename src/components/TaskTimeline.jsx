import { useEffect, useId, useRef, useState } from 'react'
import {
  capabilityState,
  controllers,
  imgBase,
  methods,
  skills,
  tasks,
  trialsPerTask,
} from '../content.js'
import VideoSlot from './VideoSlot.jsx'

// The timeline replays the task sequence: the grid starts with A01 alone and
// gains one column per step, and controller / skill rows appear as the agent
// acquires them. `reached` is the index of the newest task shown; the detail
// panel always describes that task.
const STEP_MS = 4000 // dwell on each newly reached task
const HOLD_MS = 7000 // dwell on the full seven-task grid before looping
const LAST = tasks.length - 1
const OBS_SPLIT = 4 // A01–A04 get ground-truth poses; B01–B03 localize visually

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
        <circle cx="10" cy="10" r="7" />
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

const clipBadge = {
  acquired: 'New',
  used: 'Used',
  retained: 'In library',
}

const count = (n, noun) => `${n} ${noun}${n === 1 ? '' : 's'}`

// Controller and skill identifiers mentioned in prose are shown as inline code,
// matching the Method Overview caption. Longest ids first so `wall_high_reach`
// is not split by `wall_reach`.
const identifierPattern = new RegExp(
  `(${[...controllers, ...skills]
    .map((c) => c.id)
    .sort((a, b) => b.length - a.length)
    .join('|')})`,
  'g',
)

function Prose({ text }) {
  return text
    .split(identifierPattern)
    .map((part, index) => (index % 2 === 1 ? <code key={index}>{part}</code> : part))
}

function CapabilityRow({ capability, reached, onSelect }) {
  return (
    <>
      <div className="tl-row-label">
        <code>{capability.id}</code>
      </div>
      {tasks.slice(0, reached + 1).map((task, position) => {
        const state = capabilityState(capability, position)
        const prev = position > 0 ? capabilityState(capability, position - 1) : 'absent'
        const next = position < reached ? capabilityState(capability, position + 1) : 'absent'
        const exists = state !== 'absent'
        const lineLeft = exists && prev !== 'absent'
        const lineRight = exists && next !== 'absent'
        const classes = ['tl-cell', position === reached ? 'is-selected' : '']
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

function SuccessRow({ method, reached, onSelect }) {
  return (
    <>
      <div className="tl-row-label is-method">
        <span className="tl-swatch" style={{ background: `var(${method.colorVar})` }} aria-hidden="true" />
        <span>{method.label}</span>
      </div>
      {tasks.slice(0, reached + 1).map((task, position) => {
        const successes = task.success[method.id]
        const rate = Math.round((100 * successes) / trialsPerTask)
        const classes = [
          'tl-cell',
          'is-rate',
          method.id === 'elevate' ? 'is-ours' : '',
          position === reached ? 'is-selected' : '',
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

function ObservationBand({ reached }) {
  const groundTruth = Math.min(reached + 1, OBS_SPLIT)
  const visual = reached + 1 - groundTruth
  return (
    <>
      <div className="tl-row-label is-obs">Task observations</div>
      <div className="tl-obs" style={{ gridColumn: `2 / span ${groundTruth}` }}>
        Ground-truth target pose provided
      </div>
      {visual > 0 ? (
        <div className="tl-obs is-visual" style={{ gridColumn: `${2 + OBS_SPLIT} / span ${visual}` }}>
          Visual target localization only
        </div>
      ) : null}
    </>
  )
}

// A row of clips for every capability of one kind that exists at this step,
// each badged with its role on the current task (newly learned, used, or only
// retained in the library).
function LibraryRow({ title, items, reached, task }) {
  const clips = items.filter((c) => c.video && capabilityState(c, reached) !== 'absent')
  if (clips.length === 0) return null
  const acquiredHere = clips.some((c) => task.usage[c.id] === 'acquired')
  return (
    <div className="tl-detail-clips">
      <p className="tl-detail-label">
        {title} after {task.id}
        {acquiredHere ? <span className="tl-detail-badge">new</span> : null}
      </p>
      <ul>
        {clips.map((capability) => {
          const state = capabilityState(capability, reached)
          return (
            <li key={capability.id} className={`tl-clip is-${state}`}>
              <div className="tl-clip-frame">
                <VideoSlot
                  file={capability.video}
                  label={`${capability.id} ${capability.kind}, ${stateLabel[state]} on ${task.id}`}
                  aspect="16 / 9"
                  autoPlay
                  hoverControls
                  loopRange={capability.loop ?? null}
                  className="tl-detail-clip"
                />
                <span className="tl-clip-badge" aria-hidden="true">
                  {clipBadge[state]}
                </span>
              </div>
              <code>{capability.id}</code>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function TaskTimeline() {
  const [reached, setReached] = useState(0)
  const [isAuto, setIsAuto] = useState(true)
  const [inView, setInView] = useState(false)
  const figureRef = useRef(null)
  const detailId = useId()
  const sliderId = useId()

  // Only advance while the section is on screen, so the loop is at its start
  // when a visitor scrolls to it rather than somewhere mid-sequence.
  useEffect(() => {
    const element = figureRef.current
    if (!element || typeof window.IntersectionObserver !== 'function') {
      setInView(true)
      return undefined
    }
    const observer = new window.IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.15,
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isAuto || !inView) return undefined
    const delay = reached === LAST ? HOLD_MS : STEP_MS
    const timerId = window.setTimeout(() => setReached((current) => (current + 1) % tasks.length), delay)
    return () => window.clearTimeout(timerId)
  }, [isAuto, inView, reached])

  useEffect(() => {
    tasks.forEach((task) => {
      const image = new window.Image()
      image.src = `${imgBase}/tasks/${task.id}.png`
    })
  }, [])

  // Any manual choice hands control to the visitor until they press play again.
  const select = (position) => {
    setIsAuto(false)
    setReached(Math.min(LAST, Math.max(0, position)))
  }

  const task = tasks[reached]
  const liveControllers = controllers.filter((c) => capabilityState(c, reached) !== 'absent')
  const liveSkills = skills.filter((c) => capabilityState(c, reached) !== 'absent')
  const progress = (100 * reached) / LAST

  return (
    <figure className="timeline" ref={figureRef}>
      <div className="timeline-controls">
        <button
          className={`tl-play-button${isAuto ? ' is-auto' : ''}`}
          type="button"
          aria-pressed={isAuto}
          aria-label={isAuto ? 'Auto-play is on; switch to manual control' : 'Manual control; switch to auto-play'}
          onClick={() => setIsAuto((value) => !value)}
        >
          <span className={isAuto ? 'tl-pause-icon' : 'tl-play-icon'} aria-hidden="true" />
        </button>

        <div className="tl-slider">
          <label className="tl-sr-only" htmlFor={sliderId}>
            Tasks reached
          </label>
          <input
            id={sliderId}
            className="tl-range"
            type="range"
            min={0}
            max={LAST}
            step={1}
            value={reached}
            style={{ '--tl-progress': `${progress}%` }}
            aria-valuetext={`After ${task.id}: ${reached + 1} of ${tasks.length} tasks`}
            onChange={(event) => select(Number(event.target.value))}
            onPointerDown={() => setIsAuto(false)}
          />
          <div className="tl-ticks" aria-hidden="true">
            {tasks.map((item, position) => (
              <button
                key={item.id}
                type="button"
                tabIndex={-1}
                className={`tl-tick${position <= reached ? ' is-reached' : ''}${position === reached ? ' is-current' : ''}`}
                style={{ '--tl-stop': position / LAST }}
                onClick={() => select(position)}
              >
                {item.id}
              </button>
            ))}
          </div>
        </div>

        <span className="tl-position" aria-live="polite">
          After {task.id} · {count(liveControllers.length, 'controller')} · {count(liveSkills.length, 'skill')}
        </span>
      </div>

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

      <div className="timeline-scroll">
        <div
          className="timeline-grid"
          style={{ '--tl-n': reached + 1 }}
          role="group"
          aria-label="Task sequence with capability acquisition and reuse"
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') {
              event.preventDefault()
              select(reached + 1)
            } else if (event.key === 'ArrowLeft') {
              event.preventDefault()
              select(reached - 1)
            }
          }}
        >
          <ObservationBand reached={reached} />
          <div className="tl-row-label is-header">
            <span className="tl-family">Task</span>
          </div>
          {tasks.slice(0, reached + 1).map((item, position) => {
            const isActive = position === reached
            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? 'step' : undefined}
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

          <div className="tl-band" style={{ gridColumn: `1 / span ${reached + 2}` }}>
            <span>Controllers</span>
            <span className="tl-band-count" key={liveControllers.length}>
              {liveControllers.length} in library
            </span>
            <span className="tl-band-note">Trained with RL. The agent adds three to the initial one.</span>
          </div>
          {liveControllers.map((capability) => (
            <CapabilityRow key={capability.id} capability={capability} reached={reached} onSelect={select} />
          ))}

          <div className="tl-band is-skills" style={{ gridColumn: `1 / span ${reached + 2}` }}>
            <span>Skills</span>
            <span className="tl-band-count" key={liveSkills.length}>
              {liveSkills.length} in library
            </span>
            <span className="tl-band-note">Python programs written by the agent that coordinate controllers.</span>
          </div>
          {liveSkills.map((capability) => (
            <CapabilityRow key={capability.id} capability={capability} reached={reached} onSelect={select} />
          ))}

          <div className="tl-band is-rates" style={{ gridColumn: `1 / span ${reached + 2}` }}>
            <span>Success rate</span>
            <span className="tl-band-note">50 evaluation variants per task, final program of each method.</span>
          </div>
          {methods.map((method) => (
            <SuccessRow key={method.id} method={method} reached={reached} onSelect={select} />
          ))}
        </div>
      </div>

      <div className="timeline-detail" id={detailId} key={task.id}>
        <div className="tl-detail-media">
          {task.video ? (
            <VideoSlot
              file={task.video}
              label={`${task.id} rollout in simulation`}
              aspect="640 / 368"
              autoPlay
              hoverControls
              loopRange={task.loop ?? null}
              className="tl-detail-video"
            />
          ) : (
            <img className="tl-detail-thumb" src={`${imgBase}/tasks/${task.id}.png`} alt="" />
          )}
          <p className="tl-detail-media-label">{task.id} rollout · ELEVATE</p>
        </div>

        <div className="tl-detail-body">
          <p className="tl-detail-kicker">
            {task.id} · {task.family}
          </p>
          <h3 className="tl-detail-title">{task.objective}</h3>
          <p className="tl-detail-story">
            <Prose text={task.story} />
          </p>
          {task.note ? (
            <p className="tl-detail-note">
              <Prose text={task.note} />
            </p>
          ) : null}
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

        <LibraryRow title="Controller library" items={controllers} reached={reached} task={task} />
        <LibraryRow title="Skill library" items={skills} reached={reached} task={task} />
      </div>
    </figure>
  )
}
