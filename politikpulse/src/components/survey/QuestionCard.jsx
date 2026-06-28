import { useState } from 'react'

export default function QuestionCard({ question, selectedAnswer, onAnswer }) {
  if (!question) return null

  return (
    <div className="w-full max-w-2xl animate-slide-up">
      {/* Bereichs-Label */}
      <div className="mb-3">
        <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-500/30">
          {question.bereichKurz}
        </span>
      </div>

      {/* Fragentext */}
      <h2 className="text-white text-xl sm:text-2xl font-bold leading-snug mb-2">
        {question.text}
      </h2>

      {/* Zitat (nur Frage 2) */}
      {question.zitat && (
        <blockquote className="text-blue-200 text-base italic border-l-2 border-amber-500 pl-4 mb-6 mt-3 leading-relaxed">
          {question.zitat}
        </blockquote>
      )}

      {/* Antwortoptionen */}
      <div className={`mt-6 ${question.typ === 'likert' ? '' : 'space-y-3'}`}>
        {question.typ === 'likert' ? (
          <LikertScale
            optionen={question.optionen}
            selected={selectedAnswer}
            onSelect={(val) => onAnswer(question.id, val)}
          />
        ) : question.kleinParteienStart !== undefined ? (
          <PartySelect
            question={question}
            selectedAnswer={selectedAnswer}
            onAnswer={onAnswer}
          />
        ) : (
          question.optionen.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswer(question.id, index)}
              className={`option-card ${selectedAnswer === index ? 'selected' : 'bg-white'}`}
            >
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                  ${selectedAnswer === index
                    ? 'border-amber-500 bg-amber-500'
                    : 'border-slate-300'
                  }`}>
                  {selectedAnswer === index && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </span>
                <span className={`text-sm sm:text-base leading-snug ${
                  selectedAnswer === index ? 'text-amber-900 font-medium' : 'text-slate-700'
                }`}>
                  {option}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

// ─── Parteienauswahl mit aufklappbaren Kleinparteien ─────────────────────────

function PartySelect({ question, selectedAnswer, onAnswer }) {
  const [showKlein, setShowKlein] = useState(false)

  const { optionen, kleinParteienStart, kleinParteienEnd, id } = question

  const grosseParteien  = optionen.slice(0, kleinParteienStart)
  const kleineParteien  = optionen.slice(kleinParteienStart, kleinParteienEnd + 1)
  const sonstigeOptionen = optionen.slice(kleinParteienEnd + 1)

  const isKleinSelected = selectedAnswer >= kleinParteienStart && selectedAnswer <= kleinParteienEnd

  return (
    <div className="space-y-3">
      {/* Große Parteien */}
      {grosseParteien.map((option, index) => (
        <OptionButton
          key={index}
          label={option}
          index={index}
          selected={selectedAnswer === index}
          onSelect={() => onAnswer(id, index)}
        />
      ))}

      {/* Kleine Parteien – aufklappbar */}
      <div className="rounded-xl overflow-hidden border-2 border-dashed border-white/20">
        <button
          onClick={() => setShowKlein(!showKlein)}
          className={`w-full flex items-center justify-between px-5 py-3.5 transition-all text-sm font-semibold
            ${isKleinSelected
              ? 'bg-amber-500/20 text-amber-300 border-amber-500'
              : 'bg-white/5 text-blue-200 hover:bg-white/10'
            }`}
        >
          <span className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all
              ${isKleinSelected ? 'border-amber-500 bg-amber-500' : 'border-white/30'}`}>
              {isKleinSelected && <span className="w-2 h-2 rounded-full bg-white" />}
            </span>
            {isKleinSelected
              ? `✓ ${optionen[selectedAnswer]}`
              : '🔽 Weitere / Kleinparteien'
            }
          </span>
          <span className="text-white/40 text-xs">
            {showKlein ? '▲ schließen' : '▼ öffnen'}
          </span>
        </button>

        {showKlein && (
          <div className="bg-white/5 px-3 py-3 space-y-2 border-t border-white/10">
            {kleineParteien.map((option, i) => {
              const index = kleinParteienStart + i
              return (
                <button
                  key={index}
                  onClick={() => { onAnswer(id, index); setShowKlein(false) }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg border transition-all text-sm
                    ${selectedAnswer === index
                      ? 'border-amber-500 bg-amber-500/20 text-amber-200 font-medium'
                      : 'border-white/10 text-blue-100 hover:border-amber-400/50 hover:bg-white/10'
                    }`}
                >
                  {option}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Sonstige Optionen (unentschieden, nicht wählen) */}
      {sonstigeOptionen.map((option, i) => {
        const index = kleinParteienEnd + 1 + i
        return (
          <OptionButton
            key={index}
            label={option}
            index={index}
            selected={selectedAnswer === index}
            onSelect={() => onAnswer(id, index)}
          />
        )
      })}
    </div>
  )
}

function OptionButton({ label, index, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`option-card ${selected ? 'selected' : 'bg-white'}`}
    >
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
          ${selected ? 'border-amber-500 bg-amber-500' : 'border-slate-300'}`}>
          {selected && <span className="w-2 h-2 rounded-full bg-white" />}
        </span>
        <span className={`text-sm sm:text-base leading-snug ${
          selected ? 'text-amber-900 font-medium' : 'text-slate-700'
        }`}>
          {label}
        </span>
      </div>
    </button>
  )
}

// ─── Likert-Skala ──────────────────────────────────────────────────────────────

function LikertScale({ optionen, selected, onSelect }) {
  return (
    <div>
      <div className="flex gap-2">
        {optionen.map((option, index) => {
          const value = index + 1
          const isSelected = selected === value
          return (
            <button
              key={value}
              onClick={() => onSelect(value)}
              className={`likert-btn ${isSelected ? 'selected' : 'bg-white'}`}
            >
              <span className="text-lg font-bold">{value}</span>
              <span className="text-center hidden sm:block leading-tight" style={{ fontSize: '10px' }}>
                {getLikertShortLabel(index)}
              </span>
            </button>
          )
        })}
      </div>
      <div className="flex justify-between mt-3 text-xs text-blue-300">
        <span>Stimme überhaupt nicht zu</span>
        <span>Stimme voll zu</span>
      </div>
      {selected !== undefined && (
        <div className="mt-4 text-center text-amber-300 text-sm font-medium animate-fade-in">
          Ausgewählt: {optionen[selected - 1]}
        </div>
      )}
    </div>
  )
}

function getLikertShortLabel(index) {
  return ['Gar nicht', 'Eher nicht', 'Teils,\nteils', 'Eher\nzu', 'Voll zu'][index] || ''
}
