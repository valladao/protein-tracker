interface HistoryItem {
  date: string
  total: number
  percent: number
}

interface HistoryListProps {
  history: HistoryItem[]
}

export default function HistoryList({ history }: HistoryListProps) {
  return (
    <div className="mt-6">
      <h2 className="font-semibold mb-2">Last Days</h2>
      <ul className="space-y-1 text-sm font-mono text-gray-700">
        {history.map((item) => (
          <li key={item.date} className="flex justify-between">
            <span>{item.date}</span>
            <span>{item.total}g ({item.percent}%)</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
