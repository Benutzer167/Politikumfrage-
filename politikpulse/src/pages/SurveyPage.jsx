import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { questions } from '../data/questions'
import QuestionCard from '../components/survey/QuestionCard'
import ProgressBar from '../components/survey/ProgressBar'
import { submitResponse } from '../utils/api'
import { APPS_SCRIPT_URL } from '../config'

export default function SurveyPage() {
  const [currentIndex, setCurrentIndex]   = useState(0)
  const [answers, setAnswers]             = useState({})
  const [isSubmitting, setIsSubmitting]   = useState(false)
  const navigate = useNavigate()

  const currentQuestion = questions[currentIndex]
  const totalQuestions  = questions.length
  const isLastQuestion  = currentIndex === totalQuestions - 1
  const canProceed      = answers[currentQuestion.id] !== undefined

  function handleAnswer(questionId, value) {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  function handleBack() {
    if (currentIndex > 0) setCurrentIndex(i => i - 1)
  }

  async function handleNext() {
    if (isLastQuestion) {
      setIsSubmitting(true)
      try {
        await submitResponse(answers)
      } catch (err) {
        console.error('Fehler beim Senden:', err)
        // Trotzdem weiterleiten – Daten wurden mit no-cors gesendet
      } finally {
        setIsSubmitting(false)
        navigate('/danke')
      }
    } else {
      setCurrentIndex(i => i + 1)
      // Sanftes Scrollen nach oben bei Fragewechsel (Mobile)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-civic-950 via-civic-900 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          {/* Logo-Icon: stilisierter Puls / Balkendiagramm */}
          <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-end gap-0.5 px-1.5 pb-1 shadow-lg shadow-amber-500/30">
            <div className="w-1.5 bg-white/60 rounded-sm" style={{ height: '55%' }} />
            <div className="w-1.5 bg-white rounded-sm" style={{ height: '80%' }} />
            <div className="w-1.5 bg-white/80 rounded-sm" style={{ height: '65%' }} />
            <div className="w-1.5 bg-white/50 rounded-sm" style={{ height: '40%' }} />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">PolitikPulse</span>
        </div>

        <div className="flex items-center gap-2">
          {!APPS_SCRIPT_URL && (
            <span className="text-amber-400 text-xs bg-amber-400/10 border border-amber-400/20 px-2 py-1 rounded-full">
              Demo-Modus
            </span>
          )}
          <a
            href="#/dashboard"
            className="text-blue-300 hover:text-white text-xs transition-colors font-medium"
          >
            Dashboard →
          </a>
        </div>
      </header>

      {/* Fortschritt */}
      <ProgressBar current={currentIndex + 1} total={totalQuestions} />

      {/* Frage */}
      <main className="flex-1 flex items-center justify-center px-5 py-8">
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={answers[currentQuestion.id]}
          onAnswer={handleAnswer}
        />
      </main>

      {/* Navigation */}
      <nav className="px-5 pb-8 flex gap-3 max-w-2xl mx-auto w-full">
        {currentIndex > 0 && (
          <button onClick={handleBack} className="btn-secondary flex-shrink-0">
            ← Zurück
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed || isSubmitting}
          className="btn-primary flex-1"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner />
              Wird gespeichert…
            </span>
          ) : isLastQuestion ? (
            'Abschicken ✓'
          ) : (
            'Weiter →'
          )}
        </button>
      </nav>

      {/* Datenschutz-Hinweis */}
      <footer className="text-center text-blue-400/60 text-xs pb-6 px-4">
        Diese Umfrage ist vollständig anonym. Es werden keine personenbezogenen Daten gespeichert.
      </footer>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
