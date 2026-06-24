import { useNavigate } from 'react-router-dom'

export default function ThankYouPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-civic-950 via-civic-900 to-slate-900 flex flex-col items-center justify-center px-6 text-center">
      {/* Checkmark Animation */}
      <div className="w-24 h-24 bg-green-500/20 border-2 border-green-500/40 rounded-full flex items-center justify-center mb-8 animate-slide-up">
        <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-4xl font-bold text-white mb-3 animate-slide-up">
        Vielen Dank!
      </h1>
      <p className="text-blue-200 text-lg max-w-md leading-relaxed mb-2 animate-slide-up">
        Deine Antworten wurden anonym gespeichert und fließen in die Auswertung ein.
      </p>
      <p className="text-blue-300/60 text-sm max-w-sm mb-10 animate-slide-up">
        Die Ergebnisse werden im Politikunterricht gemeinsam ausgewertet und diskutiert.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 animate-slide-up">
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-primary"
        >
          Ergebnisse ansehen →
        </button>
        <button
          onClick={() => navigate('/')}
          className="btn-secondary"
        >
          Erneut teilnehmen
        </button>
      </div>

      {/* Branding */}
      <div className="mt-16 flex items-center gap-2 opacity-40">
        <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-end gap-0.5 px-1 pb-0.5">
          <div className="w-1 bg-white/60 rounded-sm" style={{ height: '55%' }} />
          <div className="w-1 bg-white rounded-sm" style={{ height: '80%' }} />
          <div className="w-1 bg-white/80 rounded-sm" style={{ height: '65%' }} />
          <div className="w-1 bg-white/50 rounded-sm" style={{ height: '40%' }} />
        </div>
        <span className="text-white text-sm font-semibold">PolitikPulse</span>
      </div>
    </div>
  )
}
