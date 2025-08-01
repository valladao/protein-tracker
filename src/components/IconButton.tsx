import type { ButtonHTMLAttributes } from 'react'
import { Plus, X, Star } from 'lucide-react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'add' | 'delete' | 'favorite'
}

export default function IconButton({ variant, ...props }: IconButtonProps) {
  const baseStyle = 'p-2 rounded-full flex items-center justify-center cursor-pointer'
  const variants = {
    add: 'bg-blue-500 text-white hover:bg-blue-600',
    delete: 'bg-red-100 text-red-600 hover:bg-red-200',
    favorite: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200',
  }
  const icons = {
    add: <Plus size={18} />,
    delete: <X size={18} />,
    favorite: <Star size={18} fill="currentColor" />,
  }

  return (
    <button
      className={`${baseStyle} ${variants[variant]}`}
      {...props}
      aria-label={variant}
    >
      {icons[variant]}
    </button>
  )
}
