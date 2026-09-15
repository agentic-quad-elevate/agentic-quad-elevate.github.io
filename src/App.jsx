import './App.css'
import { ANONYMOUS, identity, imgBase, paper, totals, videos } from './content.js'
import SuccessChart from './components/SuccessChart.jsx'
import TaskTimeline from './components/TaskTimeline.jsx'
import VideoSlot from './components/VideoSlot.jsx'

const visibleLinks = paper.links.filter((link) => !(ANONYMOUS && link.publicOnly))

function Hero() {
  return (
    <section className="hero-section">
      <div className="container is-max-desktop has-text-centered">
        <h1 className="publication-title">{paper.title}</h1>

        {ANONYMOUS ? (
          <div className="publication-authors">
            <span className="author-block">Anonymous Authors</span>
          </div>
        ) : (
          <>
            <div className="publication-authors">
              {identity.authors.map((author, index) => (
                <span key={author.name}>
                  <span className="author-block">
                    <a href={author.href}>{author.name}</a>
                    <sup>{author.affiliation}</sup>
                  </span>
                  {index < identity.authors.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
            <div className="publication-affiliations">
              {identity.affiliations.map((affiliation) => (
                <span key={affiliation.mark}>
                  <sup>{affiliation.mark}</sup>
                  {affiliation.name}
                </span>
              ))}
            </div>
            <p className="corresponding-authors">{identity.correspondingText}</p>
          </>
        )}

        <p className="venue">{paper.venue}</p>

        <div className="publication-links" aria-label="Paper resources">
          {visibleLinks.map((link) => (
            <a className="button is-dark is-rounded" href={link.href} key={link.label}>
              <span className="icon">
                <i className={link.iconClass}></i>
              </span>
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function App() {
  return (
    <main>
      <Hero />

      <section className="section teaser-section">
        <div className="container is-max-widescreen">
          <TaskTimeline />
          <p className="teaser-caption">
            <strong>Seven tasks, one growing library.</strong> The agent starts with a single pretrained
            loco-manipulation controller. When a task keeps failing, it diagnoses the missing capability, trains a
            new controller with reinforcement learning, wraps it in a Python skill, and keeps both for later tasks.
            Click a task or step through the sequence.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container is-max-desktop">
          <h2 className="title">Abstract</h2>
          <div className="content has-text-justified">
            <p>{paper.abstract}</p>
          </div>
          <figure className="figure overview-figure">
            <img src={`${imgBase}/overview.png`} alt="Reusing existing controllers and learning missing capabilities" />
            <figcaption>
              <strong>Reusing existing controllers and learning missing capabilities.</strong> The robot uses its
              current learned controllers to pick up a bottle. When a wall-mounted rack lies beyond its reach, it
              identifies the capability gap and trains wall-supported controllers in simulation to complete the task.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="section overview-video-section" id="video">
        <div className="container is-max-desktop">
          <h2 className="title">Video</h2>
          <VideoSlot file={videos.overview} label="ELEVATE overview video" className="overview-video" />
        </div>
      </section>

      <section className="section">
        <div className="container is-max-widescreen">
          <h2 className="title">Method Overview</h2>
          <figure className="figure method-figure">
            <img src={`${imgBase}/method.png`} alt="Overview of ELEVATE" />
            <figcaption>
              The agent synthesizes, evaluates, and refines task programs using its capability library (left).
              Persistent failures after refinement motivate controller learning (middle): the agent assesses
              feasibility, formulates an RL problem, and revises training using behavior feedback. Validated
              controllers support skill composition and renewed task solving. The right panels illustrate this
              process for bottle placement.
            </figcaption>
          </figure>
          <div className="method-steps">
            <article className="method-step">
              <span className="method-step-number">1</span>
              <h3>Task program synthesis and refinement</h3>
              <p>
                Following ASPIRE, the agent writes Python task programs that call high-level skills, which in turn
                command low-level controllers. Development trials return numerical outcomes, execution traces, and
                visual feedback for revising the program. When the budget runs out, the agent asks whether the
                remaining failures point to a missing physical capability rather than a poor composition of
                existing skills.
              </p>
            </article>
            <article className="method-step">
              <span className="method-step-number">2</span>
              <h3>Low-level controller learning</h3>
              <p>
                The proposed behavior becomes an RL problem built from one of two training templates: body
                reconfiguration (change posture using environmental support) or supported manipulation (track
                end-effector targets while holding a posture). The agent configures the scene, rewards, curriculum,
                resets, and termination conditions, runs PPO, inspects behavior measurements, and revises its own
                formulation until the controller shows the intended behavior.
              </p>
            </article>
            <article className="method-step">
              <span className="method-step-number">3</span>
              <h3>Skill composition and capability reuse</h3>
              <p>
                Validated controllers join the library. The agent writes skills that coordinate commands and
                switching between new and existing controllers, then returns to the original task. One task can
                trigger several acquisitions in sequence. Published skills and controllers stay available for every
                later task, so capability accumulates across the campaign.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section acquisition-section">
        <div className="container is-max-desktop">
          <h2 className="title">From Task Failure to New Controllers</h2>
          <p className="lead">
            On A02, the target sits 1.25 m above the floor. With only the loco-manipulation controller, repeated
            development sweeps yield <strong>0/15</strong> successes. The agent diagnoses insufficient arm-base
            elevation and proposes two complementary controllers before any training: <code>wall_stand</code> to
            raise the body using front-foot wall support, and <code>wall_reach</code> to track end-effector targets
            from that stance. The whole training workflow then runs without human intervention.
          </p>
          <figure className="figure">
            <img
              src={`${imgBase}/self_improvement.png`}
              alt="Autonomous improvement through reward revision on A02"
            />
            <figcaption>
              <strong>Autonomous improvement through reward revision.</strong> Left: the initial controller sits
              backward without the intended elevation and wall support. Center: the agent revises its rewards.
              Right: the controller acquires the elevated, wall-supported stance after revision and further
              training.
            </figcaption>
          </figure>
          <div className="acquisition-columns">
            <div>
              <h3>The agent debugs its own reward</h3>
              <p>
                Under its initial reward design, the policy earns orientation reward while sitting backward, without
                sufficient elevation or wall support. By inspecting reward components and recorded rollouts, the
                agent identifies the mismatch between reward and intended behavior and rewrites the formulation:
              </p>
              <ul>
                <li>Replace narrow target-height tracking with a reward for increasing arm-mount height.</li>
                <li>Add rewards for the front feet approaching and contacting the wall.</li>
                <li>Reward rear-foot contact with the floor.</li>
              </ul>
            </div>
            <div>
              <h3>Validated before it is used</h3>
              <p>
                After revision and further training, the selected controller raises the arm mount to about 0.62 m
                and holds the wall-supported stance with simulated body assistance disabled. Only then is it added
                to the library and composed with <code>wall_reach</code> into the <code>wall_high_reach</code>{' '}
                skill, which solves A02 at 50/50 and is reused unchanged on A03.
              </p>
              <p className="muted">
                In five independent end-to-end runs on A02, every run identified the need for body elevation,
                acquired two controllers, and reached 92% to 100% task success.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section results-section">
        <div className="container is-max-widescreen">
          <h2 className="title">Task Coverage</h2>
          <div className="stat-tiles">
            {totals.map((total, index) => (
              <div className={`stat-tile${index === 0 ? ' is-hero' : ''}`} key={total.id}>
                <span className="stat-label">
                  <span className="tl-swatch" style={{ background: `var(${total.colorVar})` }} aria-hidden="true" />
                  {total.label}
                </span>
                <span className="stat-value">{total.rate.toFixed(1)}%</span>
                <span className="stat-sub">
                  {total.successes}/{total.trials} successes across seven tasks
                </span>
              </div>
            ))}
          </div>
          <SuccessChart />
          <p className="lead results-lead">
            Both baselines operate over a fixed library of learned controllers and score <strong>0/50</strong> on
            each of the five tasks that require reaching above the workspace of the floor-supported controller.
            After acquiring <code>wall_stand</code>, <code>wall_reach</code>, and <code>wall_descent</code>, ELEVATE
            reaches 92% to 100% on all five. The remaining failures are execution failures inside the expanded
            workspace: target dwells that run past a stage deadline, and bottles that fall during placement on B03.
          </p>
        </div>
      </section>

      <section className="section real-section">
        <div className="container is-max-widescreen">
          <h2 className="title">Zero-Shot Deployment on the Physical Robot</h2>
          <div className="hardware-row">
            <figure className="figure">
              <img src={`${imgBase}/hardware.png`} alt="Unitree Go2 with Agilex PiPER arm, D405 RGB-D camera, front camera, and LiDAR" />
            </figure>
            <div className="hardware-text">
              <p className="lead">
                A Unitree Go2 quadruped carries a 6-DoF Agilex PiPER arm, an Intel RealSense D405 RGB-D camera at
                the end effector, a front RGB camera, and a LiDAR. SAM 3 provides object masks; masks from the
                wrist camera are combined with aligned depth to localize targets in the robot frame.
              </p>
              <figure className="figure perception-figure">
                <img src={`${imgBase}/perception_sam3.png`} alt="Camera image and SAM 3 segmentation mask" />
                <figcaption>Camera image and the corresponding SAM 3 segmentation mask.</figcaption>
              </figure>
            </div>
          </div>
          <p className="lead">
            All controller weights transfer <strong>unchanged from simulation</strong>, with no training or
            fine-tuning on real-robot data. The task programs compose loco-manipulation, wall elevation, supported
            manipulation, and floor recovery.
          </p>
          <div className="real-grid">
            <figure className="real-item">
              <h3>
                B02 · Rack retrieval <span className="real-score">18/20</span>
              </h3>
              <VideoSlot file={videos.b02} label="B02 rack retrieval on the physical robot" />
              <img src={`${imgBase}/real_b02_storyboard.png`} alt="B02 storyboard with active skills and controllers" />
              <figcaption>
                Retrieve a bottle from the 1.2 m rack and return to a four-foot stance while keeping hold of it.
                Bands show the active skill and controller. The two failures come from limited gripper contact
                that lets the bottle slip during floor recovery.
              </figcaption>
            </figure>
            <figure className="real-item">
              <h3>
                B03 · Floor-to-rack placement <span className="real-score">16/20</span>
              </h3>
              <VideoSlot file={videos.b03} label="B03 floor-to-rack placement on the physical robot" />
              <img src={`${imgBase}/real_b03_storyboard.png`} alt="B03 storyboard with active skills and controllers" />
              <figcaption>
                Pick a bottle up from the floor and place it upright on the rack. Failures mainly arise from
                unintended gripper contact during floor pickup.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {ANONYMOUS ? null : (
        <section className="section">
          <div className="container is-max-desktop">
            <h2 className="title">BibTeX</h2>
            <pre className="citation">
              <code>{identity.bibtex}</code>
            </pre>
          </div>
        </section>
      )}

      <footer className="footer">
        <div className="container is-max-desktop">
          <p>
            {ANONYMOUS
              ? 'Anonymous supplementary website. Page layout adapted from the Eureka project page template.'
              : identity.footer}
          </p>
        </div>
      </footer>
    </main>
  )
}

export default App
