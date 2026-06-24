import { useState, useEffect } from 'react'
import { getLastParticipation } from '../../utils/statistics'
import { APPS_SCRIPT_URL } from '../../config'

export default function OverviewCards({ responses }) {
  const [expectedN, setExpectedN] = useState(() => {
    return parseInt(localStorage.getItem('pp_expected_n') || '30')
  })
  const [editingN, setEditingN] = useState(false)
  const [tempN, setTempN]       = useState(expectedN)

  const total        = responses.length
  const lastDate     = getLastParticipation(responses)
  const returnRate   = expectedN > 0 ? Math.round((total / expectedN) * 100) : null

  function saveExpectedN() {
    const n = parseInt(tempN)
    if (!isNaN(n) && n > 0) {
      setExpectedN(n)
      localStorage.setItem('pp_expected_n', String(n))
    }
    setEditingN(false)
  }

  const cards = [
    {
      label: 'Teilnahmen gesamt',
      value: total,
      icon: '👥',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Letzte Teilnahme',
      value: lastDate ? lastDate.toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '–',
      icon: '🕐',
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      small: true,
    },
    {
      label: 'Rücklaufquote',
      value: returnRate !== null ? `${returnRate} %` : '–',
      icon: '📊',
      color: returnRate >= 80 ? 'text-green-600' : returnRate >= 50 ? 'text-amber-600' : 'text-red-500',
      bg: returnRate >= 80 ? 'bg-green-50' : returnRate >= 50 ? 'bg-amber-50' : 'bg-red-50',
      sub: `von ${expectedN} erwartet`,
    },
    {
      label: 'Backend',
      value: APPS_SCRIPT_URL ? 'Verbunden' : 'Demo-Modus',
      icon: APPS_SCRIPT_URL ? '✅' : '🔶',
      color: APPS_SCRIPT_URL ? 'text-green-600' : 'text-amber-600',
      bg: APPS_SCRIPT_URL ? 'bg-green-50' : 'bg-amber-50',
      sub: APPS_SCRIPT_URL ? 'Google Sheets aktiv' : 'Keine .env konfiguriert',
    },
  ]

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {cards.map((card, i) => (
          <div key={i} className="stat-card">
            <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center text-xl mb-3`}>
              {card.icon}
            </div>
            <div className={`${card.small ? 'text-base' : 'text-2xl'} font-bold ${card.color} leading-tight`}>
              {card.value}
            </div>
            <div className="text-slate-500 text-sm mt-1">{card.label}</div>
            {card.sub && <div className="text-slate-400 text-xs mt-0.5">{card.sub}</div>}
          </div>
        ))}
      </div>

      {/* Rücklaufquoten-Einstellung */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-4 flex-wrap">
        <span className="text-slate-600 text-sm font-medium">Erwartete Teilnehmerzahl:</span>
        {editingN ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={tempN}
              onChange={e => setTempN(e.target.value)}
              className="w-20 border border-slate-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              onKeyDown={e => e.key === 'Enter' && saveExpectedN()}
              autoFocus
            />
            <button onClick={saveExpectedN} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">
              Speichern
            </button>
            <button onClick={() => setEditingN(false)} className="text-xs text-slate-500 hover:text-slate-700">
              Abbrechen
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">{expectedN}</span>
            <button
              onClick={() => { setTempN(expectedN); setEditingN(true) }}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Ändern
            </button>
          </div>
        )}
        {returnRate !== null && (
          <div className="ml-auto">
            <div className="flex items-center gap-2">
              <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    returnRate >= 80 ? 'bg-green-500' : returnRate >= 50 ? 'bg-amber-500' : 'bg-red-400'
                  }`}
                  style={{ width: `${Math.min(returnRate, 100)}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-700">{returnRate} %</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
