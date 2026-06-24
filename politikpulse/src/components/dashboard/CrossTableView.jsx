import { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { questions } from '../../data/questions'
import { getCrossTab } from '../../utils/statistics'
import { CHART_COLORS_ALPHA } from '../../config'

// Vorschläge aus dem PRD
const SUGGESTED_PAIRS = [
  { row: 'q1', col: 'q8', label: 'Mediennutzung × Wahlabsicht' },
  { row: 'q2', col: 'q8', label: 'Chancengleichheit × Wahlabsicht' },
  { row: 'q4', col: 'q8', label: 'Klimaschutz × Wahlabsicht' },
  { row: 'q5', col: 'q8', label: 'EU-Einstellung × Wahlabsicht' },
  { row: 'q6', col: 'q8', label: 'Außenpolitik × Wahlabsicht' },
  { row: 'q7', col: 'q8', label: 'Umgang mit AfD × Wahlabsicht' },
]

export default function CrossTableView({ responses }) {
  const [rowQ, setRowQ] = useState('q1')
  const [colQ, setColQ] = useState('q8')
  const [showPercent, setShowPercent] = useState(true)

  const rowQuestion = questions.find(q => q.id === rowQ)
  const colQuestion = questions.find(q => q.id === colQ)

  const crossTab = getCrossTab(
    responses,
    rowQ, colQ,
    rowQuestion.optionen,
    colQuestion.optionen
  )

  // Gruppiertes Balkendiagramm
  const chartData = {
    labels: crossTab.rowLabels.map(l => shortenLabel(l, 25)),
    datasets: crossTab.colLabels.map((colLabel, ci) => ({
      label: shortenLabel(colLabel, 20),
      data: crossTab.rowLabels.map((_, ri) =>
        showPercent ? crossTab.matrixPercent[ri][ci] : crossTab.matrix[ri][ci]
      ),
      backgroundColor: CHART_COLORS_ALPHA[ci % CHART_COLORS_ALPHA.length],
      borderRadius: 4,
    }))
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { size: 10 }, padding: 10, boxWidth: 14, boxHeight: 14 }
      },
      tooltip: {
        callbacks: {
          label: ctx => showPercent
            ? ` ${ctx.dataset.label}: ${ctx.raw.toFixed(1)} %`
            : ` ${ctx.dataset.label}: ${ctx.raw}`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 20 } },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: { font: { size: 10 } },
        title: { display: true, text: showPercent ? 'Anteil (%)' : 'Anzahl', font: { size: 10 } }
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Schnellauswahl */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Empfohlene Analysen (aus dem PRD)
        </div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_PAIRS.map((pair) => (
            <button
              key={pair.label}
              onClick={() => { setRowQ(pair.row); setColQ(pair.col) }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                rowQ === pair.row && colQ === pair.col
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700'
              }`}
            >
              {pair.label}
            </button>
          ))}
        </div>
      </div>

      {/* Manuelle Auswahl */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Manuelle Auswahl
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Zeilen-Variable (Y)</label>
            <select
              value={rowQ}
              onChange={e => setRowQ(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {questions.filter(q => q.id !== colQ).map(q => (
                <option key={q.id} value={q.id}>F{q.nummer}: {q.bereichKurz}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Spalten-Variable (X)</label>
            <select
              value={colQ}
              onChange={e => setColQ(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {questions.filter(q => q.id !== rowQ).map(q => (
                <option key={q.id} value={q.id}>F{q.nummer}: {q.bereichKurz}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ergebnis */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4">
          <h3 className="text-white font-semibold">
            F{rowQuestion.nummer} ({rowQuestion.bereichKurz}) × F{colQuestion.nummer} ({colQuestion.bereichKurz})
          </h3>
          <p className="text-slate-400 text-xs mt-1">N = {crossTab.grandTotal} gültige Antworten</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Anzeige-Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">Anzeige:</span>
            <div className="flex rounded-lg border border-slate-200 overflow-hidden">
              {['Prozent', 'Absolut'].map((label, i) => (
                <button
                  key={label}
                  onClick={() => setShowPercent(i === 0)}
                  className={`px-3 py-1.5 text-xs font-medium transition-all ${
                    (i === 0) === showPercent
                      ? 'bg-slate-800 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Diagramm */}
          <div>
            <Bar data={chartData} options={chartOptions} />
          </div>

          {/* Kreuztabelle */}
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="bg-slate-50 border border-slate-200 px-3 py-2 text-left text-slate-500 font-semibold min-w-[120px]">
                    {rowQuestion.bereichKurz} ↓ / {colQuestion.bereichKurz} →
                  </th>
                  {crossTab.colLabels.map((label, ci) => (
                    <th key={ci} className="bg-slate-50 border border-slate-200 px-2 py-2 text-center text-slate-600 font-medium max-w-[100px]">
                      <div className="leading-tight">{shortenLabel(label, 15)}</div>
                    </th>
                  ))}
                  <th className="bg-slate-100 border border-slate-200 px-2 py-2 text-center text-slate-700 font-bold">
                    Σ
                  </th>
                </tr>
              </thead>
              <tbody>
                {crossTab.rowLabels.map((rowLabel, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="border border-slate-200 px-3 py-2 text-slate-700 font-medium leading-tight">
                      {shortenLabel(rowLabel, 30)}
                    </td>
                    {crossTab.colLabels.map((_, ci) => {
                      const pct = crossTab.matrixPercent[ri][ci]
                      const abs = crossTab.matrix[ri][ci]
                      return (
                        <td key={ci} className="border border-slate-200 px-2 py-2 text-center">
                          {showPercent ? (
                            <span className={`font-medium ${pct >= 30 ? 'text-blue-700' : 'text-slate-600'}`}>
                              {pct.toFixed(1)} %
                            </span>
                          ) : (
                            <span className={`font-medium ${abs >= 5 ? 'text-blue-700' : 'text-slate-600'}`}>
                              {abs}
                            </span>
                          )}
                        </td>
                      )
                    })}
                    <td className="border border-slate-200 px-2 py-2 text-center font-bold text-slate-700 bg-slate-50">
                      {crossTab.rowTotals[ri]}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100">
                  <td className="border border-slate-200 px-3 py-2 font-bold text-slate-700 text-xs uppercase tracking-wide">
                    Gesamt
                  </td>
                  {crossTab.colTotals.map((t, ci) => (
                    <td key={ci} className="border border-slate-200 px-2 py-2 text-center font-bold text-slate-700">
                      {t}
                    </td>
                  ))}
                  <td className="border border-slate-200 px-2 py-2 text-center font-bold text-slate-900 bg-slate-200">
                    {crossTab.grandTotal}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-xs text-slate-400">
            Prozentwerte beziehen sich auf die Zeilensumme (innerhalb der Zeilen-Variable).
          </p>
        </div>
      </div>
    </div>
  )
}

function shortenLabel(str, maxLen) {
  if (!str) return ''
  if (str.length <= maxLen) return str
  return str.slice(0, maxLen - 1) + '…'
}
