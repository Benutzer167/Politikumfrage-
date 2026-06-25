import { useState } from 'react'

export default function PasswordProtect({ onUnlock }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  // ⬇️ HIER DEIN PASSWORT EINTRAGEN:
 const DASHBOARD_PASSWORD = import.meta.env.VITE_DASHBOARD_PASSWORD

  function handleSubmit(e) {
    e.preventDefault()
    if (password === DASHBOARD_PASSWORD) {
      onUnlock()
      setError(false)
    } else {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg">
            🔐
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">
          Dashboard
        </h1>
        <p className="text-slate-500 text-center mb-6">
          Gib das Passwort ein um die Ergebnisse zu sehen
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Passwort eingeben"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                error
                  ? 'border-red-500 bg-red-50'
                  : 'border-slate-200 focus:border-blue-500'
              }`}
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm font-medium">
              ❌ Falsches Passwort
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Entsperren
          </button>
        </form>

        <p className="text-xs text-slate-400 mt-6 text-center">
          PolitikPulse Dashboard
        </p>
      </div>
    </div>
  )
}
