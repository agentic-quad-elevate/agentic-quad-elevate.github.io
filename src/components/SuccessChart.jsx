import { useState } from 'react'
import { methods, tasks, trialsPerTask } from '../content.js'

const WIDTH = 840
const HEIGHT = 320
const MARGIN = { top: 30, right: 12, bottom: 46, left: 46 }
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom
const GROUP_W = PLOT_W / tasks.length
const BAR_W = 20
const BAR_GAP = 2
const GROUP_INNER = methods.length * BAR_W + (methods.length - 1) * BAR_GAP
const TICKS = [0, 25, 50, 75, 100]

const yFor = (value) => MARGIN.top + PLOT_H * (1 - value / 100)

// Bar with a 4px rounded data-end and a square baseline. Zero values draw a
// 2px stub so the bar is visibly present at zero.
function barPath(x, value) {
  const baseline = yFor(0)
  const top = value === 0 ? baseline - 2 : yFor(value)
  const height = baseline - top
  const radius = Math.min(4, height)
  return [
    `M${x} ${baseline}`,
    `L${x} ${top + radius}`,
    `Q${x} ${top} ${x + radius} ${top}`,
    `L${x + BAR_W - radius} ${top}`,
    `Q${x + BAR_W} ${top} ${x + BAR_W} ${top + radius}`,
    `L${x + BAR_W} ${baseline}`,
    'Z',
  ].join(' ')
}

export default function SuccessChart() {
  const [hover, setHover] = useState(null)
  const [showTable, setShowTable] = useState(false)

  return (
    <div className="chart">
      <ul className="chart-legend" aria-label="Series">
        {methods.map((method) => (
          <li key={method.id}>
            <span className="tl-swatch" style={{ background: `var(${method.colorVar})` }} aria-hidden="true" />
            {method.label}
          </li>
        ))}
      </ul>

      <div className="chart-plot" onMouseLeave={() => setHover(null)}>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="Success rate per task for ELEVATE, ASPIRE, and Code-as-Policy. Full values are in the table below."
        >
          {TICKS.map((tick) => (
            <g key={tick}>
              <line
                className={tick === 0 ? 'chart-axis' : 'chart-grid'}
                x1={MARGIN.left}
                x2={WIDTH - MARGIN.right}
                y1={yFor(tick)}
                y2={yFor(tick)}
              />
              <text className="chart-tick" x={MARGIN.left - 8} y={yFor(tick) + 4} textAnchor="end">
                {tick}%
              </text>
            </g>
          ))}

          {tasks.map((task, taskPosition) => {
            const groupX = MARGIN.left + taskPosition * GROUP_W + (GROUP_W - GROUP_INNER) / 2
            return (
              <g key={task.id}>
                {methods.map((method, methodPosition) => {
                  const successes = task.success[method.id]
                  const value = (100 * successes) / trialsPerTask
                  const x = groupX + methodPosition * (BAR_W + BAR_GAP)
                  const isHover = hover && hover.task === taskPosition && hover.method === methodPosition
                  return (
                    <g key={method.id}>
                      <path
                        className={`chart-bar${isHover ? ' is-hover' : ''}`}
                        d={barPath(x, value)}
                        style={{ fill: `var(${method.colorVar})` }}
                      />
                      {method.id === 'elevate' ? (
                        <text className="chart-value" x={x + BAR_W / 2} y={yFor(value) - 6} textAnchor="middle">
                          {Math.round(value)}%
                        </text>
                      ) : null}
                      <rect
                        className="chart-hit"
                        x={x - BAR_GAP / 2}
                        y={MARGIN.top}
                        width={BAR_W + BAR_GAP}
                        height={PLOT_H}
                        onMouseEnter={() =>
                          setHover({
                            task: taskPosition,
                            method: methodPosition,
                            x: x + BAR_W / 2,
                            y: value === 0 ? yFor(0) - 2 : yFor(value),
                          })
                        }
                        onFocus={() =>
                          setHover({
                            task: taskPosition,
                            method: methodPosition,
                            x: x + BAR_W / 2,
                            y: value === 0 ? yFor(0) - 2 : yFor(value),
                          })
                        }
                        onBlur={() => setHover(null)}
                        tabIndex={0}
                        aria-label={`${method.label} on ${task.id}: ${successes} of ${trialsPerTask}`}
                      />
                    </g>
                  )
                })}
                <text
                  className="chart-xlabel"
                  x={MARGIN.left + taskPosition * GROUP_W + GROUP_W / 2}
                  y={HEIGHT - MARGIN.bottom + 20}
                  textAnchor="middle"
                >
                  {task.id}
                </text>
                <text
                  className="chart-xsub"
                  x={MARGIN.left + taskPosition * GROUP_W + GROUP_W / 2}
                  y={HEIGHT - MARGIN.bottom + 35}
                  textAnchor="middle"
                >
                  {task.short}
                </text>
              </g>
            )
          })}
        </svg>

        {hover ? (
          <div
            className="chart-tooltip"
            style={{ left: `${(100 * hover.x) / WIDTH}%`, top: `${(100 * hover.y) / HEIGHT}%` }}
            role="status"
          >
            <strong>{tasks[hover.task].id}</strong> · {methods[hover.method].label}
            <br />
            {tasks[hover.task].success[methods[hover.method].id]}/{trialsPerTask} successes
          </div>
        ) : null}
      </div>

      <button className="chart-table-toggle" type="button" onClick={() => setShowTable((value) => !value)} aria-expanded={showTable}>
        {showTable ? 'Hide table' : 'Show as table'}
      </button>

      {showTable ? (
        <div className="policy-table-wrapper">
          <table className="policy-table">
            <caption>Successes out of 50 evaluation variants per task, final program of each method.</caption>
            <thead>
              <tr>
                <th scope="col">Method</th>
                {tasks.map((task) => (
                  <th scope="col" key={task.id}>
                    {task.id}
                  </th>
                ))}
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {methods.map((method) => {
                const total = tasks.reduce((sum, task) => sum + task.success[method.id], 0)
                const rowClass = method.id === 'elevate' ? 'policy-row-highlight' : ''
                return (
                  <tr key={method.id} className={rowClass}>
                    <th scope="row">{method.label}</th>
                    {tasks.map((task) => (
                      <td key={task.id}>{task.success[method.id]}/50</td>
                    ))}
                    <td>
                      <strong>
                        {total}/{tasks.length * trialsPerTask}
                      </strong>{' '}
                      ({((100 * total) / (tasks.length * trialsPerTask)).toFixed(1)}%)
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
