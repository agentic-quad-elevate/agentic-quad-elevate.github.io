import { strategies } from '../content.js'
import Prose from './Prose.jsx'
import VideoSlot from './VideoSlot.jsx'

// Side-by-side comparison of the same task solved in two environments: the
// rollout on top, a caption, and the controllers the agent trained in that run.
export default function StrategyComparison() {
  return (
    <>
      <p className="strategies-intro">
        <Prose text={strategies.intro} />
      </p>
      <div className="strategy-grid">
        {strategies.variants.map((variant) => (
          <article className="strategy" key={variant.id}>
            <h3>
              <span className="strategy-title">{variant.title}</span>
              <span className="strategy-tag">{variant.tag}</span>
            </h3>
            <VideoSlot
              file={variant.video}
              label={variant.videoLabel}
              aspect="640 / 368"
              autoPlay
              hoverControls
              className="strategy-video"
            />
            <p className="strategy-caption">
              <Prose text={variant.caption} />
            </p>
            <p className="tl-detail-label">Learned controllers</p>
            <ul className="strategy-controllers">
              {variant.controllers.map((controller) => (
                <li key={controller.id}>
                  <VideoSlot
                    file={controller.video}
                    label={`${controller.id} controller`}
                    aspect="16 / 9"
                    autoPlay
                    hoverControls
                    loopRange={controller.loop ?? null}
                    className="strategy-clip"
                  />
                  <code>{controller.id}</code>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </>
  )
}
