interface HeaderProps {
  nick: string
  meta: number | null
  total: number
  percent: number
}

export default function Header({ nick, meta, total, percent }: HeaderProps) {
  return (
    <div className="text-center mb-4">
      <h1 className="text-2xl font-bold">Hello, {nick}</h1>
      <p className="text-sm text-gray-600">Daily goal: {meta ?? '-'}g</p>
      <p className="text-sm text-gray-600 mb-2">
        Consumed today: {total}g ({percent}%)
      </p>
    </div>
  )
}
