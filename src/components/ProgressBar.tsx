interface ProgressBarProps {
  percent: number
}

export default function ProgressBar({ percent }: ProgressBarProps) {
  const capped = Math.min(percent, 100)
  const bgColor = percent >= 100 ? 'bg-green-600' : 'bg-blue-500'

  return (
    <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden mb-6">
      <div
        className={`${bgColor} h-full text-white text-sm font-semibold text-center`}
        style={{ width: `${capped}%` }}
      >
        {percent}%
      </div>
    </div>
  )
}
