import { createBrowserRouter, redirect } from "react-router-dom"
import App from "./App"
import { authLoader } from "./features/auth/AuthRoute"
import { loginAction } from "./features/auth/LoginRoute"
import { registerAction } from "./features/auth/RegisterRoute"
import {
  diligentAction,
  diligentLoader,
} from "./features/diligent/DiligentRoute"
import {
  setAvatarAction,
  setAvatarLoader,
} from "./features/setAvatar/SetAvatarRoute"
import Diligent from "./pages/Diligent"
import Login from "./pages/Login"
import Register from "./pages/Register"
import RouteError from "./pages/RouteError"
import SetAvatar from "./pages/SetAvatar"

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <RouteError />,
    element: <App />,
    children: [
      {
        index: true,
        loader: diligentLoader,
        action: diligentAction,
        shouldRevalidate: () => false,
        element: <Diligent />,
      },
      {
        path: "setAvatar",
        loader: setAvatarLoader,
        action: setAvatarAction,
        shouldRevalidate: () => false,
        element: <SetAvatar />,
      },
      {
        path: "register",
        loader: authLoader,
        action: registerAction,
        element: <Register />,
      },
      {
        path: "login",
        loader: authLoader,
        action: loginAction,
        element: <Login />,
      },
      {
        path: "logout",
        loader: () => {
          localStorage.clear()
          return redirect("/login")
        },
      },
    ],
  },
  {
    path: "*",
    loader: () => redirect("/login"),
  },
])

export default router
