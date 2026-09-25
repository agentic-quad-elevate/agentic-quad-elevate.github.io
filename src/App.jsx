import './App.css'
import { ANONYMOUS, demos, identity, imgBase, paper, videos } from './content.js'
import RealExperiments from './components/RealExperiments.jsx'
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

      <section className="section hero-video-section">
        <div className="container is-max-desktop">
          <VideoSlot file={videos.teaser} label="ELEVATE teaser" autoPlay hoverControls className="hero-video" />
        </div>
      </section>

      <section className="section">
        <div className="container is-max-desktop">
          <h2 className="title">Abstract</h2>
          <div className="content">
            <p>{paper.abstract}</p>
          </div>
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
              <strong>Overview of ELEVATE.</strong> The agent synthesizes and refines task programs using its
              capability library. Persistent failures after refinement (1) motivate controller learning (2): the
              agent assesses feasibility, formulates an RL problem, and revises training using behavior feedback.
              Validated controllers are added to the library and composed into high-level skills (3), enabling
              renewed task execution and eventual completion (4). The right panels schematically illustrate bottle
              placement: <code>wall_stand</code> elevates the body using wall support, while{' '}
              <code>wall_reach</code> enables manipulation from that stance. The <code>wall_high_reach</code> skill
              coordinates these controllers.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="section experiments-section">
        <div className="container is-max-widescreen">
          <h2 className="title">Capability Growth Across Sequential Tasks</h2>
          <TaskTimeline />
          <p className="timeline-caption">
            <strong>Seven tasks, one growing library.</strong> The agent starts with a single pretrained
            loco-manipulation controller. When a task keeps failing, it diagnoses the missing capability, trains a
            new controller with reinforcement learning, wraps it in a Python skill, and keeps both for later tasks.
            Press play to watch the library grow task by task, or drag the slider to any point in the sequence.
          </p>
        </div>
      </section>

      <section className="section real-section">
        <div className="container is-max-widescreen">
          <h2 className="title">Real Experiments</h2>
          <RealExperiments />
        </div>
      </section>

      <section className="section demos-section">
        <div className="container is-max-widescreen">
          <h2 className="title">More Real-Robot Demonstrations</h2>
          <div className="demo-rows">
            {demos.map((demo) => (
              <article className="demo-row" key={demo.id}>
                <VideoSlot file={demo.video} label={demo.videoLabel} autoPlay hoverControls className="demo-video" />
                <div className="demo-text">
                  <h3>
                    <span className="demo-title">{demo.title}</span>
                    <span className="demo-tag">{demo.tag}</span>
                  </h3>
                  {demo.paragraphs.map((text, index) => (
                    <p key={index}>{text}</p>
                  ))}
                </div>
              </article>
            ))}
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
