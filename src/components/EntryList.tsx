interface Entry {
  id: string
  name: string
  protein: number
  timestamp: number
  onDelete: (id: string) => void
  onFavorite: (id: string) => void
}

interface EntryListProps {
  entries: Entry[]
}

export default function EntryList({ entries }: EntryListProps) {
  return (
    <div className="mb-6">
      <h2 className="font-semibold mb-2">Today Entries</h2>
      <ul className="space-y-1">
        {entries.map(entry => (
          <li key={entry.id} className="flex items-center justify-between bg-white rounded shadow-sm px-3 py-2">
            <div>
              <p className="font-medium text-sm">{entry.name}</p>
              <p className="text-xs text-gray-500">
                {entry.protein}g - {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => entry.onFavorite(entry.id)}
                className="text-yellow-500 text-sm"
              >
                ★
              </button>
              <button
                onClick={() => entry.onDelete(entry.id)}
                className="text-red-500 text-sm"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
