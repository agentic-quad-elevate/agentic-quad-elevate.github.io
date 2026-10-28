import { methods, runsPerTask, tasks, totals, trialsPerTask } from '../content.js'

// Task success rates, methods as rows and tasks as columns: baselines first,
// ours last, best mean per task in bold, overall column at the right.
const rows = [...methods].reverse()
const fmt = (value) => value.toFixed(1)

const columns = [
  ...tasks.map((task) => ({ id: task.id, short: task.short, rates: task.success })),
  { id: 'Overall', short: '', rates: Object.fromEntries(totals.map((total) => [total.id, total])) },
]
const bestByColumn = Object.fromEntries(
  columns.map((column) => [column.id, Math.max(...rows.map((method) => column.rates[method.id].mean))]),
)

function RateCell({ column, method }) {
  const rate = column.rates[method.id]
  const classes = [column.id === 'Overall' ? 'is-overall' : '', rate.mean === bestByColumn[column.id] ? 'is-best' : '']
  return (
    <td className={classes.join(' ').trim()}>
      {fmt(rate.mean)} <span className="results-std">± {fmt(rate.std)}</span>
    </td>
  )
}

export default function ResultsTable() {
  return (
    <figure className="results-figure">
      <table className="results-table">
        <caption>
          Task success rates (%). Mean ± sample standard deviation across {runsPerTask} independent runs,{' '}
          {trialsPerTask} variants per task. Bold marks the best mean on each task.
        </caption>
        <thead>
          <tr>
            <th scope="col">Method</th>
            {columns.map((column) => (
              <th scope="col" key={column.id} className={column.id === 'Overall' ? 'is-overall' : ''}>
                <span className="results-task-id">{column.id}</span>
                {column.short ? <span className="results-task-short">{column.short}</span> : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((method) => (
            <tr key={method.id} className={method.id === 'elevate' ? 'is-ours' : ''}>
              <th scope="row">{method.label}</th>
              {columns.map((column) => (
                <RateCell key={column.id} column={column} method={method} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
