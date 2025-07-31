import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { RouterProvider } from 'react-router'
import { appRouter } from './routes'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={appRouter} />
  </React.StrictMode>
)

// src/routes.tsx
import { createBrowserRouter } from 'react-router'
import Home from './pages/Home'
import User from './pages/User'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/u/:nick',
    element: <User />,
  },
])
