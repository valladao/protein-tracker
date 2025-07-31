import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { db } from '../lib/firebase'
import { ref, get, child, push } from 'firebase/database'

interface Entry {
  name: string
  protein: number
  timestamp: number
}

interface Food {
  name: string
  protein: number
}

export default function User() {
  const { nick } = useParams<{ nick: string }>()
  const [meta, setMeta] = useState<number>(0)
  const [entries, setEntries] = useState<Entry[]>([])
  const [foods, setFoods] = useState<Record<string, Food>>({})
  const [name, setName] = useState('')
  const [protein, setProtein] = useState('')

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
        const list = Object.values(val) as Entry[]
        const sorted = list.sort((a, b) => b.timestamp - a.timestamp)
        setEntries(sorted)
      }
    })

    get(child(userRef, 'foods')).then(snapshot => {
      if (snapshot.exists()) setFoods(snapshot.val())
    })
  }, [nick, today])

  const total = entries.reduce((sum, e) => sum + e.protein, 0)

  const handleAddEntry = async () => {
    if (!nick || !name || !protein) return

    const entry: Entry = {
      name,
      protein: parseFloat(protein),
      timestamp: Date.now(),
    }

    const entryRef = ref(db, `users/${nick}/entries/${today}`)
    await push(entryRef, entry)

    setName('')
    setProtein('')

    const snapshot = await get(entryRef)
    if (snapshot.exists()) {
      const val = snapshot.val()
      const list = Object.values(val) as Entry[]
      const sorted = list.sort((a, b) => b.timestamp - a.timestamp)
      setEntries(sorted)
    }
  }

  const handleFavorite = async (entry: Entry) => {
    if (!nick) return
    const foodRef = ref(db, `users/${nick}/foods`)
    await push(foodRef, {
      name: entry.name,
      protein: entry.protein,
    })
    const snapshot = await get(foodRef)
    if (snapshot.exists()) setFoods(snapshot.val())
  }

  const handleQuickAdd = async (foodId: string) => {
    const food = foods[foodId]
    if (!food || !nick) return

    const entryRef = ref(db, `users/${nick}/entries/${today}`)
    await push(entryRef, {
      name: food.name,
      protein: food.protein,
      timestamp: Date.now(),
    })

    const snapshot = await get(entryRef)
    if (snapshot.exists()) {
      const val = snapshot.val()
      const list = Object.values(val) as Entry[]
      const sorted = list.sort((a, b) => b.timestamp - a.timestamp)
      setEntries(sorted)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Hello, {nick}</h1>
      <p className="mb-2">Daily goal: {meta}g</p>
      <p className="mb-4">Consumed today: {total}g ({Math.round((total / meta) * 100)}%)</p>

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
        {entries.map((e, i) => (
          <li key={i} className="text-sm flex items-center justify-between">
            <span>{e.name} - {e.protein}g ({new Date(e.timestamp).toLocaleTimeString()})</span>
            <button
              className="text-yellow-500 hover:text-yellow-600 ml-2"
              onClick={() => handleFavorite(e)}
              title="Add to favorites"
            >★</button>
          </li>
        ))}
      </ul>

      <h2 className="font-semibold mb-2">Favorite Foods</h2>
      <ul className="mb-4">
        {Object.entries(foods).reverse().map(([id, f]) => (
          <li key={id} className="text-sm flex items-center justify-between">
            <span>{f.name}: {f.protein}g</span>
            <button
              className="bg-blue-600 text-white px-2 py-1 text-xs rounded hover:bg-blue-700"
              onClick={() => handleQuickAdd(id)}
            >Add</button>
          </li>
        ))}
      </ul>

    </div>
  )
}
