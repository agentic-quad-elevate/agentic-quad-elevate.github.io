import { imgBase, realExperiments } from '../content.js'
import VideoSlot from './VideoSlot.jsx'

// Real-robot experiments stacked vertically: each shows its video, storyboard, and caption.
// The storyboard's label column (Skills / Controllers) hangs in a left gutter sized by
// `storyboardLabel`, so its five frames line up with the video above them.
export default function RealExperiments() {
  return (
    <div className="real-list">
      {realExperiments.map((experiment) => (
        <figure
          key={experiment.id}
          className="real-item"
          id={`real-${experiment.id}`}
          style={{ '--label': experiment.storyboardLabel ?? 0 }}
        >
          <h3 className="real-heading">
            <span className="real-code">{experiment.code}</span>
            <span>{experiment.title}</span>
            <span className="real-score">{experiment.score}</span>
          </h3>
          <VideoSlot file={experiment.video} label={experiment.videoLabel} autoPlay hoverControls />
          <img src={`${imgBase}/${experiment.storyboard}`} alt={experiment.storyboardAlt} />
          <figcaption>{experiment.caption}</figcaption>
        </figure>
      ))}
    </div>
  )
}
