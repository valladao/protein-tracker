import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { db } from '../lib/firebase'
import { ref, get, child, push, remove } from 'firebase/database'

interface Entry {
  name: string
  protein: number
  timestamp: number
  id?: string
}

interface Food {
  name: string
  protein: number
}

export default function User() {
  const { nick } = useParams<{ nick: string }>()
  const [meta, setMeta] = useState<number | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])
  const [foods, setFoods] = useState<Record<string, Food>>({})
  const [name, setName] = useState('')
  const [protein, setProtein] = useState('')
  const [history, setHistory] = useState<
    { date: string; total: number; percent: number }[]
  >([])

  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    if (!nick) return

    const userRef = ref(db, `users/${nick}`)
    get(child(userRef, 'meta')).then(snapshot => {
      if (snapshot.exists()) setMeta(snapshot.val())
    })

    get(child(userRef, `entries/${today}`)).then(snapshot => {
      if (snapshot.exists()) {
        const val = snapshot.val()
        const list = Object.entries(val).map(([id, data]) => {
          const entry = data as Omit<Entry, 'id'>
          return { ...entry, id }
        })
        const sorted = list.sort((a, b) => b.timestamp - a.timestamp)
        setEntries(sorted)
      }
    })

    get(child(userRef, 'foods')).then(snapshot => {
      if (snapshot.exists()) setFoods(snapshot.val())
    })
  }, [nick, today, meta])

  useEffect(() => {
    if (!nick) return

    const getHistory = async () => {
      const promises = []
      const days = [...Array(5).keys()].map(i => {
        const d = new Date()
        d.setDate(d.getDate() - (i + 1))
        return d.toISOString().slice(0, 10)
      })

      for (const day of days) {
        const p = get(ref(db, `users/${nick}/entries/${day}`)).then(snap => {
          let total = 0
          if (snap.exists()) {
            const val = snap.val()
            const values = Object.values(val) as { protein: number }[]
            total = values.reduce((sum, e) => sum + e.protein, 0)
          }
          return {
            date: day.slice(5),
            total,
            percent: meta ? Math.round((total / meta) * 100) : 0
          }
        })
        promises.push(p)
      }

      const results = await Promise.all(promises)
      setHistory(results)
    }

    getHistory()
  }, [nick, meta])

  const total = entries.reduce((sum, e) => sum + e.protein, 0)
  const percent = meta ? Math.round((total / meta) * 100) : 0

  const refreshEntries = async () => {
    const snapshot = await get(ref(db, `users/${nick}/entries/${today}`))
    if (snapshot.exists()) {
      const val = snapshot.val()
      const list = Object.entries(val).map(([id, data]) => {
        const entry = data as Omit<Entry, 'id'>
        return { ...entry, id }
      })
      const sorted = list.sort((a, b) => b.timestamp - a.timestamp)
      setEntries(sorted)
    } else {
      setEntries([])
    }
  }

  const handleAddEntry = async () => {
    if (!nick || !name || !protein) return

    const entry = {
      name,
      protein: parseFloat(protein),
      timestamp: Date.now(),
    }

    await push(ref(db, `users/${nick}/entries/${today}`), entry)
    setName('')
    setProtein('')
    refreshEntries()
  }

  const handleFavorite = async (entry: Entry) => {
    if (!nick) return
    await push(ref(db, `users/${nick}/foods`), {
      name: entry.name,
      protein: entry.protein,
    })
    const snapshot = await get(ref(db, `users/${nick}/foods`))
    if (snapshot.exists()) setFoods(snapshot.val())
  }

  const handleQuickAdd = async (foodId: string) => {
    const food = foods[foodId]
    if (!food || !nick) return
    await push(ref(db, `users/${nick}/entries/${today}`), {
      name: food.name,
      protein: food.protein,
      timestamp: Date.now(),
    })
    refreshEntries()
  }

  const handleDeleteEntry = async (id: string) => {
    if (!nick || !id) return
    await remove(ref(db, `users/${nick}/entries/${today}/${id}`))
    refreshEntries()
  }

  const handleDeleteFood = async (id: string) => {
    if (!nick || !id) return
    await remove(ref(db, `users/${nick}/foods/${id}`))
    const snapshot = await get(ref(db, `users/${nick}/foods`))
    if (snapshot.exists()) setFoods(snapshot.val())
    else setFoods({})
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Hello, {nick}</h1>
      <p className="mb-2">Daily goal: {meta ?? '-'}g</p>
      <p className="mb-4">Consumed today: {total}g ({percent}%)</p>

      <div className="w-full h-6 bg-gray-200 rounded-full mb-4 overflow-hidden">
        <div
          className={`h-full text-sm font-semibold text-center text-white transition-all duration-300 ${percent >= 100 ? 'bg-green-600' : 'bg-blue-500'
            }`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        >
          {percent}%
        </div>
      </div>

      <h2 className="font-semibold mb-2">Favorite Foods</h2>
      <ul className="mb-4">
        {Object.entries(foods).reverse().map(([id, f]) => (
          <li key={id} className="text-sm flex items-center justify-between">
            <span>{f.name}: {f.protein}g</span>
            <div className="flex gap-2">
              <button
                className="bg-blue-600 text-white px-2 py-1 text-xs rounded hover:bg-blue-700"
                onClick={() => handleQuickAdd(id)}
              >Add</button>
              <button
                className="text-red-500 hover:text-red-600 text-xs"
                onClick={() => handleDeleteFood(id)}
              >✕</button>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="font-semibold mb-2">Add New Entry</h2>
      <div className="flex gap-2">
        <input
          className="border p-2 rounded"
          placeholder="Food name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 rounded w-32"
          placeholder="Protein (g)"
          type="number"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleAddEntry}
        >
          Add
        </button>
      </div>

      <h2 className="font-semibold mb-2">Today Entries</h2>
      <ul className="mb-4">
        {entries.map((e) => (
          <li key={e.timestamp} className="text-sm flex items-center justify-between">
            <span>{e.name} - {e.protein}g ({new Date(e.timestamp).toLocaleTimeString()})</span>
            <div className="flex gap-2">
              <button
                className="text-yellow-500 hover:text-yellow-600"
                onClick={() => handleFavorite(e)}
                title="Add to favorites"
              >★</button>
              <button
                className="text-red-500 hover:text-red-600"
                onClick={() => handleDeleteEntry(e.id!)}
                title="Delete entry"
              >✕</button>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="font-semibold mt-6 mb-2">Last Days</h2>
      <ul className="text-sm space-y-1">
        {history.map((h) => (
          <li key={h.date} className="flex justify-between">
            <span>{h.date}</span>
            <span>{h.total}g ({h.percent}%)</span>
          </li>
        ))}
      </ul>

    </div>
  )
}
