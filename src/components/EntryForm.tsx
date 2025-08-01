import React, { useState } from 'react'

interface EntryFormProps {
  onAddEntry: (name: string, protein: number) => void
}

export default function EntryForm({ onAddEntry }: EntryFormProps) {
  const [name, setName] = useState('')
  const [protein, setProtein] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || isNaN(Number(protein))) return
    onAddEntry(name.trim(), Number(protein))
    setName('')
    setProtein('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center gap-2 mb-6"
    >
      <input
        className="border rounded px-3 py-2 w-full sm:w-1/2"
        type="text"
        placeholder="Food name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border rounded px-3 py-2 w-full sm:w-1/4"
        type="number"
        placeholder="Protein (g)"
        value={protein}
        onChange={(e) => setProtein(e.target.value)}
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add
      </button>
    </form>
  )
}
