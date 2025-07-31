import { useState } from "react"
import { useNavigate } from "react-router"
import { ref, set, get } from "firebase/database"
import { db } from "../lib/firebase"

export default function Home() {
  const [nick, setNick] = useState("")
  const [goal, setGoal] = useState("")
  const navigate = useNavigate()

  const handleAccess = async () => {
    if (!nick || !goal) return
    const userRef = ref(db, `users/${nick}`)
    const snapshot = await get(userRef)

    if (!snapshot.exists()) {
      await set(userRef, {
        meta: parseInt(goal),
        foods: {},
        entries: {}
      })
    }

    navigate(`/u/${nick}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Daily Protein Tracker</h1>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          Recommendation: your daily protein goal should be around 2x your body
          weight (in grams).
        </p>
        <input
          className="border p-2 rounded w-64"
          placeholder="Nick"
          value={nick}
          onChange={(e) => setNick(e.target.value)}
        />
        <input
          className="border p-2 rounded w-64"
          placeholder="Daily goal (g)"
          type="number"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={handleAccess}
        >
          Access
        </button>
      </div>
    </div>
  )
}
