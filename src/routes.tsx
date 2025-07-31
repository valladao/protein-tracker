import { createBrowserRouter } from "react-router"
import Home from "./pages/Home"
import User from "./pages/User"

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/u/:nick",
    element: <User />
  }
])
