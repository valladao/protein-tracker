// src/pages/User.tsx
import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { db } from '../lib/firebase'
import { ref, get, child } from 'firebase/database'

type Food = {
  name: string
  protein: number
}

type Entry = {
  foodId: string
  times: number
}

export default function User() {
  const { nick } = useParams<{ nick: string }>()
  const [meta, setMeta] = useState<number>(0)
  const [foods, setFoods] = useState<Record<string, Food>>({})
  const [entries, setEntries] = useState<Entry[]>([])
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    if (!nick) return
    const userRef = ref(db, `users/${nick}`)

    get(child(userRef, 'meta')).then(snapshot => {
      if (snapshot.exists()) setMeta(snapshot.val())
    })

    get(child(userRef, 'foods')).then(snapshot => {
      if (snapshot.exists()) setFoods(snapshot.val())
    })

    const today = new Date().toISOString().slice(0, 10)
    get(child(userRef, `entries/${today}`)).then(snapshot => {
      if (snapshot.exists()) setEntries(snapshot.val())
    })
  }, [nick])

  useEffect(() => {
    let total = 0
    for (const entry of entries) {
      const food = foods[entry.foodId]
      if (food) total += food.protein * entry.times
    }
    setTotal(total)
  }, [entries, foods])

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-xl font-bold mb-4">Hello, {nick}</h1>
      <p className="mb-2">Daily goal: {meta}g</p>
      <p className="mb-4">Consumed today: {total}g ({Math.round((total / meta) * 100)}%)</p>

      <h2 className="font-semibold mb-2">Entries</h2>
      <ul className="mb-6">
        {entries.map((entry, index) => (
          <li key={index} className="text-sm">
            {entry.times}x {foods[entry.foodId]?.name} ({foods[entry.foodId]?.protein * entry.times}g)
          </li>
        ))}
      </ul>

      <h2 className="font-semibold mb-2">Your foods</h2>
      <ul>
        {Object.entries(foods).map(([id, food]) => (
          <li key={id} className="text-sm">
            {food.name}: {food.protein}g per unit
          </li>
        ))}
      </ul>
    </div>
  )
}
