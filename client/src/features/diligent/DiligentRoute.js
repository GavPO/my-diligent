import { redirect } from "react-router-dom"
import axios from "axios"
import { allUsersRoute, sendMessageRoute } from "../../utils/APIRoutes"
import { toastOptions } from "../.."
import { toast } from "react-toastify"

export const diligentLoader = async () => {
  //* If there is a user logged in, direct to /
  const loggedIn = localStorage.getItem("chat-app-user")
  if (!loggedIn) return redirect("/login")

  //* Get Logged In User
  const user = await JSON.parse(localStorage.getItem("chat-app-user"))

  //* If No Avatar Image is Set, direct to /setAvatar
  if (!user.isAvatarImageSet) return redirect("/setAvatar")

  //* Get All Users
  const { data } = await axios.get(`${allUsersRoute}/${user._id}`)
  const { users } = data
  if (!users) toast.error("Unable to retrieve users", toastOptions)

  return { user, users: users || [] }
}

export const diligentAction = async ({ request }) => {
  const formData = await request.formData()
  const actionData = Object.fromEntries(formData.entries())
  actionData.from = JSON.parse(actionData.from)
  actionData.to = JSON.parse(actionData.to)
  const { data } = await axios.post(`${sendMessageRoute}`, actionData)
  if (!data.status) toast.error(data.message || "Failed to Send", toastOptions)
  return null
}
