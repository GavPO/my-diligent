import { redirect } from "react-router-dom"

export const authLoader = () => {
  //* If there is a user logged in, direct to /
  if (localStorage.getItem("chat-app-user")) return redirect("/")
  return null
}
