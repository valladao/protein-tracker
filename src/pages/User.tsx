import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { db } from '../lib/firebase'
import {
  ref,
  onValue,
  push,
  remove,
  get,
} from 'firebase/database'
import Header from '../components/Header'
import ProgressBar from '../components/ProgressBar'
import FavoriteFoods from '../components/FavoriteFoods'
import EntryForm from '../components/EntryForm'
import EntryList from '../components/EntryList'
import HistoryList from '../components/HistoryList'

interface Entry {
  id: string
  name: string
  protein: number
  timestamp: number
}

interface Food {
  id: string
  name: string
  protein: number
}

export default function User() {
  const { nick } = useParams()
  const [entries, setEntries] = useState<Entry[]>([])
  const [foods, setFoods] = useState<Food[]>([])
  const [meta, setMeta] = useState<number | null>(null)
  const [history, setHistory] = useState<{
    date: string
    total: number
    percent: number
  }[]>([])

  useEffect(() => {
    if (!nick) return

    const entriesRef = ref(db, `users/${nick}/entries`)
    const foodsRef = ref(db, `users/${nick}/foods`)
    const metaRef = ref(db, `users/${nick}/meta`)

    const today = new Date().toISOString().split('T')[0]
    const todayRef = ref(db, `users/${nick}/entries/${today}`)

    onValue(todayRef, (snap) => {
      const val = snap.val()
      if (!val) return setEntries([])
      const list = Object.entries(val as Record<string, Omit<Entry, 'id'>>).map(
        ([id, data]) => ({ ...data, id })
      )
      list.sort((a, b) => b.timestamp - a.timestamp)
      setEntries(list)
    })

    onValue(foodsRef, (snap) => {
      const val = snap.val()
      if (!val) return setFoods([])
      const list = Object.entries(val as Record<string, Omit<Food, 'id'>>).map(
        ([id, data]) => ({ ...data, id })
      )
      setFoods(list)
    })

    onValue(metaRef, (snap) => {
      setMeta(Number(snap.val()) || null)
    })

    get(entriesRef).then((snap) => {
      const val = snap.val()
      if (!val) return
      const result = Object.entries(val as Record<string, Record<string, { protein: number }>>)
        .slice(-5)
        .map(([date, items]) => {
          const values = Object.values(items)
          const total = values.reduce((sum, e) => sum + e.protein, 0)
          return {
            date,
            total,
            percent: meta ? Math.round((total / meta) * 100) : 0,
          }
        })
        .reverse()
      setHistory(result)
    })
  }, [nick, meta])

  const todayKey = new Date().toISOString().split('T')[0]

  const handleAddEntry = (name: string, protein: number) => {
    if (!nick) return
    const newEntry = {
      name,
      protein,
      timestamp: Date.now(),
    }
    push(ref(db, `users/${nick}/entries/${todayKey}`), newEntry)
  }

  const handleFavorite = (id: string) => {
    const entry = entries.find((e) => e.id === id)
    if (!entry || !nick) return
    const { name, protein } = entry
    push(ref(db, `users/${nick}/foods`), { name, protein })
  }

  const handleAddFromFood = (id: string) => {
    const food = foods.find((f) => f.id === id)
    if (!food || !nick) return
    const { name, protein } = food
    push(ref(db, `users/${nick}/entries/${todayKey}`), {
      name,
      protein,
      timestamp: Date.now(),
    })
  }

  const handleDeleteFood = (id: string) => {
    if (!nick) return
    remove(ref(db, `users/${nick}/foods/${id}`))
  }

  const handleDeleteEntry = (id: string) => {
    if (!nick) return
    remove(ref(db, `users/${nick}/entries/${todayKey}/${id}`))
  }

  const total = entries.reduce((sum, e) => sum + e.protein, 0)
  const percent = meta ? Math.round((total / meta) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <Header nick={nick ?? ''} meta={meta} total={total} percent={percent} />
        <ProgressBar percent={percent} />
        <EntryForm onAddEntry={handleAddEntry} />
        <FavoriteFoods
          foods={foods.map((f) => ({ ...f, onAdd: handleAddFromFood, onDelete: handleDeleteFood }))}
        />
        <EntryList
          entries={entries.map((e) => ({ ...e, onFavorite: handleFavorite, onDelete: handleDeleteEntry }))}
        />
        <HistoryList history={history} />
      </div>
    </div>
  )
}
