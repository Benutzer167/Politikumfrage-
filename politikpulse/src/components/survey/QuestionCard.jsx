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

function LikertScale({ optionen, selected, onSelect }) {
  // Wert 1–5 (nicht Index)
  return (
    <div>
      <div className="flex gap-2">
        {optionen.map((option, index) => {
          const value = index + 1 // 1–5
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
      {/* Labels unterhalb */}
      <div className="flex justify-between mt-3 text-xs text-blue-300">
        <span>Stimme überhaupt nicht zu</span>
        <span>Stimme voll zu</span>
      </div>
      {/* Volle Label-Anzeige wenn ausgewählt */}
      {selected !== undefined && (
        <div className="mt-4 text-center text-amber-300 text-sm font-medium animate-fade-in">
          Ausgewählt: {optionen[selected - 1]}
        </div>
      )}
    </div>
  )
}

function getLikertShortLabel(index) {
  const labels = ['Gar nicht', 'Eher nicht', 'Teils,\nteils', 'Eher\nzu', 'Voll zu']
  return labels[index] || ''
}
