import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchResponses } from '../utils/api'
import OverviewCards    from '../components/dashboard/OverviewCards'
import QuestionAnalysis from '../components/dashboard/QuestionAnalysis'
import CrossTableView   from '../components/dashboard/CrossTableView'
import QRCodePanel      from '../components/dashboard/QRCodePanel'
import ExportPanel      from '../components/dashboard/ExportPanel'
import PasswordProtect from '../components/dashboard/PasswordProtect'

const TABS = [
  { id: 'overview',   label: 'Übersicht',     icon: '📈', shortLabel: 'Übersicht' },
  { id: 'questions',  label: 'Fragen',         icon: '📊', shortLabel: 'Fragen' },
  { id: 'crosstab',   label: 'Kreuztabellen', icon: '⊞',  shortLabel: 'Kreuz' },
  { id: 'qrcode',     label: 'QR-Code',       icon: '📱', shortLabel: 'QR' },
  { id: 'export',     label: 'Export',         icon: '↓',  shortLabel: 'Export' },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab]   = useState('overview')
  const [responses, setResponses]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const navigate = useNavigate()

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchResponses()
      setResponses(data)
      setLastRefresh(new Date())
    } catch (err) {
      setError('Fehler beim Laden der Daten. Bitte API-Konfiguration prüfen.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])
if (!isUnlocked) {
  return <PasswordProtect onUnlock={() => setIsUnlocked(true)} />
}
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-950 flex flex-col
        transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-end gap-0.5 px-1.5 pb-1">
              <div className="w-1.5 bg-white/60 rounded-sm" style={{ height: '55%' }} />
              <div className="w-1.5 bg-white rounded-sm" style={{ height: '80%' }} />
              <div className="w-1.5 bg-white/80 rounded-sm" style={{ height: '65%' }} />
              <div className="w-1.5 bg-white/50 rounded-sm" style={{ height: '40%' }} />
            </div>
            <div>
              <div className="text-white font-bold text-base leading-tight">PolitikPulse</div>
              <div className="text-slate-400 text-xs">Dashboard</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false) }}
              className={`nav-item w-full ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="text-lg w-6 text-center">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Footer Links */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full text-left text-slate-500 text-xs hover:text-slate-300 transition-colors px-2 py-1"
          >
            ← Zur Umfrage
          </button>
          <div className="text-slate-600 text-xs px-2">
            {lastRefresh && `Zuletzt aktualisiert: ${lastRefresh.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1">
            <h1 className="font-bold text-slate-800 text-lg leading-tight">
              {TABS.find(t => t.id === activeTab)?.icon} {TABS.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-slate-400 text-xs hidden sm:block">
              PolitikPulse · Anonyme politische Meinungsumfrage
            </p>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">{loading ? 'Lädt…' : 'Aktualisieren'}</span>
          </button>
        </header>

        {/* Mobile Tab Bar */}
        <div className="lg:hidden bg-white border-b border-slate-200 flex overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-4 py-2.5 text-xs font-medium transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.shortLabel}
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {loading && responses.length === 0 ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={loadData} />
          ) : (
            <div className="animate-fade-in">
              {activeTab === 'overview'  && <OverviewCards   responses={responses} />}
              {activeTab === 'questions' && <QuestionAnalysis responses={responses} />}
              {activeTab === 'crosstab'  && <CrossTableView  responses={responses} />}
              {activeTab === 'qrcode'    && <QRCodePanel />}
              {activeTab === 'export'    && <ExportPanel     responses={responses} />}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" style={{ borderWidth: '3px' }} />
      <p className="text-slate-500 font-medium">Daten werden geladen…</p>
      <p className="text-slate-400 text-sm mt-1">Verbindung zu Google Sheets wird hergestellt</p>
    </div>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-red-100 text-center max-w-lg mx-auto mt-8">
      <div className="text-4xl mb-4">⚠️</div>
      <h3 className="font-bold text-slate-800 mb-2">Fehler beim Laden</h3>
      <p className="text-slate-500 text-sm mb-6">{message}</p>
      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          Erneut versuchen
        </button>
        <p className="text-xs text-slate-400">
          Stelle sicher, dass die VITE_APPS_SCRIPT_URL in der .env-Datei korrekt eingetragen ist.
          Im Demo-Modus werden Beispieldaten angezeigt (ohne .env).
        </p>
      </div>
    </div>
  )
}
