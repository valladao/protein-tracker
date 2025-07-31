import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { db } from '../lib/firebase'
import { ref, get, child, push } from 'firebase/database'

type Food = {
  name: string
  protein: number
}

type Entry = {
  foodId: string
  timestamp: number
}

export default function User() {
  const { nick } = useParams<{ nick: string }>()
  const [meta, setMeta] = useState<number>(0)
  const [foods, setFoods] = useState<Record<string, Food>>({})
  const [entries, setEntries] = useState<Entry[]>([])
  const [total, setTotal] = useState<number>(0)

  const [newFoodName, setNewFoodName] = useState('')
  const [newFoodProtein, setNewFoodProtein] = useState('')
  const [selectedFoodId, setSelectedFoodId] = useState('')

  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    if (!nick) return
    const userRef = ref(db, `users/${nick}`)

    get(child(userRef, 'meta')).then(snapshot => {
      if (snapshot.exists()) setMeta(snapshot.val())
    })

    get(child(userRef, 'foods')).then(snapshot => {
      if (snapshot.exists()) setFoods(snapshot.val())
    })

    get(child(userRef, `entries/${today}`)).then(snapshot => {
      if (snapshot.exists()) {
        const val = snapshot.val()
        const entriesArray = Object.values(val) as Entry[]
        setEntries(entriesArray)
      }
    })
  }, [nick, today])

  useEffect(() => {
    let total = 0
    for (const entry of entries) {
      const food = foods[entry.foodId]
      if (food) total += food.protein
    }
    setTotal(total)
  }, [entries, foods])

  const handleAddFood = async () => {
    if (!nick || !newFoodName || !newFoodProtein) return

    const foodRef = ref(db, `users/${nick}/foods`)
    await push(foodRef, {
      name: newFoodName,
      protein: parseFloat(newFoodProtein),
    })

    setNewFoodName('')
    setNewFoodProtein('')

    const snapshot = await get(foodRef)
    if (snapshot.exists()) setFoods(snapshot.val())
  }

  const handleAddEntry = async () => {
    if (!nick || !selectedFoodId) return

    const entryRef = ref(db, `users/${nick}/entries/${today}`)
    await push(entryRef, {
      foodId: selectedFoodId,
      timestamp: Date.now(),
    })

    const snapshot = await get(entryRef)
    if (snapshot.exists()) {
      const val = snapshot.val()
      const entriesArray = Object.values(val) as Entry[]
      setEntries(entriesArray)
    }

    setSelectedFoodId('')
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-xl font-bold mb-4">Hello, {nick}</h1>
      <p className="mb-2">Daily goal: {meta}g</p>
      <p className="mb-4">Consumed today: {total}g ({Math.round((total / meta) * 100)}%)</p>

      <h2 className="font-semibold mb-2">Entries</h2>
      <ul className="mb-6">
        {entries.map((entry, index) => (
          <li key={index} className="text-sm">
            {foods[entry.foodId]?.name} - {foods[entry.foodId]?.protein}g
            {' (' + new Date(entry.timestamp).toLocaleTimeString() + ')'}
          </li>
        ))}
      </ul>

      <h2 className="font-semibold mb-2">Your foods</h2>
      <ul className="mb-4">
        {Object.entries(foods).map(([id, food]) => (
          <li key={id} className="text-sm">
            {food.name}: {food.protein}g per unit
          </li>
        ))}
      </ul>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded"
          placeholder="Food name"
          value={newFoodName}
          onChange={(e) => setNewFoodName(e.target.value)}
        />
        <input
          className="border p-2 rounded w-32"
          placeholder="Protein (g)"
          type="number"
          value={newFoodProtein}
          onChange={(e) => setNewFoodProtein(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleAddFood}
        >
          Add
        </button>
      </div>

      <div className="flex gap-2 items-center">
        <select
          className="border p-2 rounded"
          value={selectedFoodId}
          onChange={(e) => setSelectedFoodId(e.target.value)}
        >
          <option value="">Select food</option>
          {Object.entries(foods).map(([id, food]) => (
            <option key={id} value={id}>{food.name}</option>
          ))}
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleAddEntry}
        >
          Register
        </button>
      </div>
    </div>
  )
}
