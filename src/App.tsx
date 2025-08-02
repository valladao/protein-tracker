function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 p-6">
      <h1 className="text-2xl font-bold">Daily Protein Tracker</h1>
      <p className="text-sm text-gray-500 text-center max-w-sm">
        Recommendation: your daily protein goal should be around 2x your body weight (in grams).
      </p>
      <input
        className="border p-2 rounded w-64"
        placeholder="Nick"
      />
      <input
        className="border p-2 rounded w-64"
        placeholder="Daily goal (g)"
        type="number"
      />
      <button
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Access
      </button>
    </div>
  )
}

export default App
