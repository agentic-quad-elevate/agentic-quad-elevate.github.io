import { refinement } from '../content.js'
import Prose from './Prose.jsx'
import VideoSlot from './VideoSlot.jsx'

const changeSign = { add: '+', remove: '\u2212', tune: '\u00b1' }
const changeLabel = { add: 'Added', remove: 'Removed', tune: 'Adjusted' }

// Three stages of one controller, left to right: the clip after that round
// of training, the changes the agent made to get there, and the outcome.
export default function RefinementSteps() {
  return (
    <>
      <p className="refine-intro">
        <Prose text={refinement.intro} />
      </p>
      <ol className="refine-steps">
        {refinement.stages.map((stage, index) => (
          <li className="refine-step" key={stage.id}>
            <p className="refine-kicker">
              <span className="refine-index" aria-hidden="true">
                {index + 1}
              </span>
              {stage.label}
            </p>
            <div className="refine-media">
              <VideoSlot
                file={stage.video}
                label={`wall_stand after the ${stage.label.toLowerCase()} stage`}
                aspect="16 / 9"
                autoPlay
                hoverControls
                loopRange={stage.loop ?? null}
                className="refine-video"
              />
            </div>
            <ul className="refine-changes">
              {stage.changes.map((change, changeIndex) => (
                <li key={changeIndex} className={`is-${change.kind}`}>
                  <span className="refine-sign" aria-hidden="true">
                    {changeSign[change.kind]}
                  </span>
                  <span className="refine-sr">{changeLabel[change.kind]}: </span>
                  <span>
                    <Prose text={change.text} />
                  </span>
                </li>
              ))}
            </ul>
            <p className={`refine-outcome is-${stage.outcomeKind}`}>
              <Prose text={stage.outcome} />
            </p>
          </li>
        ))}
      </ol>
    </>
  )
}
