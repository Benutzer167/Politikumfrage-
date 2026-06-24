import { useState } from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import { questions } from '../../data/questions'
import { getFrequencies, getMean, getMedian, getStdDev, getLikertDistribution, getValidCount } from '../../utils/statistics'
import { CHART_COLORS, CHART_COLORS_ALPHA, PARTY_COLORS } from '../../config'

export default function QuestionAnalysis({ responses }) {
  const [selectedQ, setSelectedQ] = useState(0)
  const [chartType, setChartType] = useState('bar')

  const question = questions[selectedQ]
  const validN   = getValidCount(responses, question.id)

  return (
    <div className="space-y-6">
      {/* Fragenauswahl */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Frage auswählen
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setSelectedQ(i)}
              className={`text-left px-4 py-3 rounded-xl border-2 text-sm transition-all ${
                selectedQ === i
                  ? 'border-blue-500 bg-blue-50 text-blue-800 font-semibold'
                  : 'border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-slate-50'
              }`}
            >
              <span className="text-slate-400 mr-2">F{q.nummer}.</span>
              {q.bereichKurz}
            </button>
          ))}
        </div>
      </div>

      {/* Fragendetail */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4">
          <div className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Frage {question.nummer} · {question.bereichKurz}
          </div>
          <h3 className="text-white font-semibold text-base leading-snug">
            {question.text}
          </h3>
          {question.zitat && (
            <p className="text-slate-300 text-sm italic mt-1">{question.zitat}</p>
          )}
          <div className="text-slate-400 text-xs mt-2">N = {validN} gültige Antworten</div>
        </div>

        <div className="p-6">
          {question.typ === 'likert' ? (
            <LikertView responses={responses} question={question} />
          ) : (
            <NominalView
              responses={responses}
              question={question}
              chartType={chartType}
              setChartType={setChartType}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Nominale Frage ────────────────────────────────────────────────────────────

function NominalView({ responses, question, chartType, setChartType }) {
  const freq  = getFrequencies(responses, question.id, question.optionen)
  const validN = freq.reduce((a, b) => a + b.count, 0)

  // Für Frage 8 (Wahlabsicht) Parteifarben verwenden
  const isPartyQ = question.id === 'q8'
  const colors = isPartyQ
    ? question.optionen.map((_, i) => CHART_COLORS_ALPHA[i % CHART_COLORS_ALPHA.length])
    : freq.map((_, i) => CHART_COLORS_ALPHA[i % CHART_COLORS_ALPHA.length])

  const chartData = {
    labels: freq.map(f => shortenLabel(f.label, 30)),
    datasets: [{
      data: freq.map(f => f.count),
      backgroundColor: colors,
      borderColor: colors.map(c => c.replace('0.8)', '1)')),
      borderWidth: 1,
      borderRadius: 6,
    }]
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => {
            const pct = validN > 0 ? ((ctx.raw / validN) * 100).toFixed(1) : 0
            return ` ${ctx.raw} Antworten (${pct} %)`
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, maxRotation: 30 },
      },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: { stepSize: 1, font: { size: 11 } },
      }
    }
  }

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: { font: { size: 11 }, padding: 12, boxWidth: 16, boxHeight: 16 }
      },
      tooltip: {
        callbacks: {
          label: ctx => {
            const pct = validN > 0 ? ((ctx.raw / validN) * 100).toFixed(1) : 0
            return ` ${ctx.raw} (${pct} %)`
          }
        }
      }
    }
  }

  const highest = freq.reduce((max, f) => f.count > max.count ? f : max, freq[0])

  return (
    <div>
      {/* Chart-Typ Auswahl */}
      <div className="flex gap-2 mb-4">
        {['bar', 'pie'].map(type => (
          <button
            key={type}
            onClick={() => setChartType(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              chartType === type
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {type === 'bar' ? '📊 Balken' : '🥧 Kreis'}
          </button>
        ))}
      </div>

      {/* Diagramm */}
      <div className={`${chartType === 'pie' ? 'max-w-lg mx-auto' : ''} mb-6`}>
        {chartType === 'bar'
          ? <Bar data={chartData} options={barOptions} />
          : <Pie data={chartData} options={pieOptions} />
        }
      </div>

      {/* Häufigkeitstabelle */}
      <div className="rounded-xl overflow-hidden border border-slate-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left px-4 py-2.5 text-slate-500 font-semibold text-xs uppercase tracking-wide">Antwortoption</th>
              <th className="text-right px-4 py-2.5 text-slate-500 font-semibold text-xs uppercase tracking-wide">n</th>
              <th className="text-right px-4 py-2.5 text-slate-500 font-semibold text-xs uppercase tracking-wide">%</th>
              <th className="px-4 py-2.5 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {freq.map((f, i) => (
              <tr key={i} className={`border-t border-slate-50 ${f.label === highest.label ? 'bg-amber-50/50' : ''}`}>
                <td className="px-4 py-2.5 text-slate-700">
                  {f.label}
                  {f.label === highest.label && validN > 0 && (
                    <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">
                      Häufigst
                    </span>
                  )}
                </td>
                <td className="text-right px-4 py-2.5 font-mono font-semibold text-slate-800">{f.count}</td>
                <td className="text-right px-4 py-2.5 font-mono text-slate-600">{f.percent.toFixed(1)} %</td>
                <td className="px-4 py-2.5">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-700"
                      style={{ width: `${f.percent}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 border-t border-slate-200">
              <td className="px-4 py-2.5 font-semibold text-slate-700 text-xs uppercase tracking-wide">Gesamt</td>
              <td className="text-right px-4 py-2.5 font-mono font-bold text-slate-800">{validN}</td>
              <td className="text-right px-4 py-2.5 font-mono text-slate-600">100 %</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

// ─── Likert-Frage ──────────────────────────────────────────────────────────────

function LikertView({ responses, question }) {
  const mean   = getMean(responses, question.id)
  const median = getMedian(responses, question.id)
  const stddev = getStdDev(responses, question.id)
  const dist   = getLikertDistribution(responses, question.id)
  const validN = responses.filter(r => r[question.id] !== null && r[question.id] !== undefined).length

  const statsItems = [
    { label: 'Mittelwert (M)', value: mean !== null ? mean.toFixed(2) : '–', icon: '∅' },
    { label: 'Median (Mdn)', value: median !== null ? median.toFixed(2) : '–', icon: '⊕' },
    { label: 'Standardabweichung (SD)', value: stddev !== null ? stddev.toFixed(2) : '–', icon: 'σ' },
    { label: 'N (gültig)', value: validN, icon: 'n' },
  ]

  const chartData = {
    labels: ['1', '2', '3', '4', '5'],
    datasets: [{
      label: 'Häufigkeit',
      data: [dist[1], dist[2], dist[3], dist[4], dist[5]],
      backgroundColor: [
        'rgba(239,68,68,0.8)',
        'rgba(249,115,22,0.8)',
        'rgba(234,179,8,0.8)',
        'rgba(34,197,94,0.7)',
        'rgba(22,163,74,0.9)',
      ],
      borderWidth: 0,
      borderRadius: 6,
    }]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => {
            const pct = validN > 0 ? ((ctx.raw / validN) * 100).toFixed(1) : 0
            return ` ${ctx.raw} Antworten (${pct} %)`
          }
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 12 } } },
      y: { grid: { color: '#f1f5f9' }, ticks: { stepSize: 1 } }
    }
  }

  return (
    <div>
      {/* Statistik-Karten */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {statsItems.map((s, i) => (
          <div key={i} className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-slate-400 text-xs mb-1">{s.icon}</div>
            <div className="text-2xl font-bold text-slate-800">{s.value}</div>
            <div className="text-slate-500 text-xs mt-1 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Verteilungsdiagramm */}
      <div className="max-w-md mx-auto mb-6">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Farbskala */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <div className="flex gap-1 flex-1 h-3">
          {['#ef4444','#f97316','#eab308','#22c55e','#16a34a'].map((c, i) => (
            <div key={i} className="flex-1 rounded" style={{ backgroundColor: c, opacity: 0.7 }} />
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-400 w-full max-w-xs">
          <span>Stimme nicht zu (1)</span>
          <span>Stimme zu (5)</span>
        </div>
      </div>
    </div>
  )
}

// ─── Hilfsfunktion ─────────────────────────────────────────────────────────────

function shortenLabel(str, maxLen) {
  if (str.length <= maxLen) return str
  return str.slice(0, maxLen - 1) + '…'
}
