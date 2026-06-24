export default function ProgressBar({ current, total }) {
  const percent = Math.round((current / total) * 100)

  return (
    <div className="px-6 pb-2">
      <div className="flex justify-between text-xs text-blue-300 mb-1.5 font-medium">
        <span>Frage {current} von {total}</span>
        <span>{percent} %</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
