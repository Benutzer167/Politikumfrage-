import { useState } from 'react'
import { exportCSV, exportXLSX, exportPDF } from '../../utils/export'

const EXPORTS = [
  {
    id: 'csv',
    label: 'CSV-Rohdaten',
    icon: '📄',
    description: 'Alle Antworten als kommagetrennte Tabelle. Ideal für eigene Auswertungen in Excel oder SPSS.',
    badge: 'Einfach',
    badgeColor: 'bg-green-100 text-green-700',
    action: exportCSV,
  },
  {
    id: 'xlsx',
    label: 'Excel-Auswertung (.xlsx)',
    icon: '📊',
    description: 'Enthält drei Blätter: Rohdaten, Häufigkeitstabellen und Likert-Statistik (F2). Bereit für den Unterricht.',
    badge: 'Empfohlen',
    badgeColor: 'bg-blue-100 text-blue-700',
    action: exportXLSX,
  },
  {
    id: 'pdf',
    label: 'PDF-Bericht',
    icon: '📋',
    description: 'Vollständiger Auswertungsbericht als PDF mit allen Häufigkeitstabellen und Statistiken.',
    badge: 'Druckfertig',
    badgeColor: 'bg-amber-100 text-amber-700',
    action: exportPDF,
  },
]

export default function ExportPanel({ responses }) {
  const [loading, setLoading] = useState({})
  const [done, setDone]       = useState({})
  const [error, setError]     = useState({})

  async function handleExport(exp) {
    setLoading(prev => ({ ...prev, [exp.id]: true }))
    setError(prev => ({ ...prev, [exp.id]: null }))
    try {
      await exp.action(responses)
      setDone(prev => ({ ...prev, [exp.id]: true }))
      setTimeout(() => setDone(prev => ({ ...prev, [exp.id]: false })), 3000)
    } catch (err) {
      console.error(err)
      setError(prev => ({ ...prev, [exp.id]: 'Fehler beim Export. Bitte erneut versuchen.' }))
    } finally {
      setLoading(prev => ({ ...prev, [exp.id]: false }))
    }
  }

  return (
    <div className="space-y-4">
      {/* Hinweis */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">📌</span>
          <div>
            <p className="text-sm font-semibold text-amber-800 mb-1">Hinweis zur Anonymität</p>
            <p className="text-sm text-amber-700">
              Die exportierten Dateien enthalten ausschließlich Antwortwerte und Zeitstempel. 
              Es sind keinerlei personenbezogene Daten enthalten.
            </p>
          </div>
        </div>
      </div>

      {/* N-Anzeige */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl">📈</div>
        <div>
          <div className="font-bold text-slate-800 text-lg">{responses.length} Antworten</div>
          <div className="text-slate-500 text-sm">werden in den Exports enthalten sein</div>
        </div>
      </div>

      {/* Export-Karten */}
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
        {EXPORTS.map(exp => (
          <div key={exp.id} className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl">
                {exp.icon}
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${exp.badgeColor}`}>
                {exp.badge}
              </span>
            </div>

            <h3 className="font-bold text-slate-800 mb-2">{exp.label}</h3>
            <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4">{exp.description}</p>

            {error[exp.id] && (
              <p className="text-xs text-red-500 mb-2">{error[exp.id]}</p>
            )}

            <button
              onClick={() => handleExport(exp)}
              disabled={loading[exp.id] || responses.length === 0}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all
                ${done[exp.id]
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
            >
              {loading[exp.id] ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Wird erstellt…
                </span>
              ) : done[exp.id] ? (
                '✓ Heruntergeladen!'
              ) : (
                `↓ ${exp.label} exportieren`
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Verwendungshinweise */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
        <h4 className="font-semibold text-slate-700 mb-3 text-sm">📚 Verwendung im Unterricht</h4>
        <div className="grid sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div>
            <p className="font-semibold text-slate-700 mb-1">CSV-Rohdaten eignen sich für:</p>
            <ul className="space-y-0.5 list-disc ml-4">
              <li>Import in SPSS, R oder Python</li>
              <li>Eigene Excel-Auswertungen</li>
              <li>Datenbankimport</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-700 mb-1">PDF-Bericht eignet sich für:</p>
            <ul className="space-y-0.5 list-disc ml-4">
              <li>Projektdokumentation</li>
              <li>Präsentation der Ergebnisse</li>
              <li>Abgabe beim Fachlehrer</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
