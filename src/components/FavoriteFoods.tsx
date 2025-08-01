import IconButton from "./IconButton"

interface FavoriteFood {
  id: string
  name: string
  protein: number
  onAdd: (id: string) => void
  onDelete: (id: string) => void
}

interface FavoriteFoodsProps {
  foods: FavoriteFood[]
}

export default function FavoriteFoods({ foods }: FavoriteFoodsProps) {
  return (
    <div className="mb-4">
      <h2 className="font-semibold mb-2">Favorite Foods</h2>
      <ul className="space-y-1">
        {foods.map(food => (
          <li key={food.id} className="flex items-center justify-between bg-gray-50 px-3 py-1 rounded">
            <span>{food.name}: {food.protein}g</span>
            <div className="space-x-2 flex">
              <IconButton variant="add" onClick={() => food.onAdd(food.id)} />
              <IconButton variant="delete" onClick={() => food.onDelete(food.id)} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
