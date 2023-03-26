import axios from "axios"
import { redirect } from "react-router-dom"
import { toast } from "react-toastify"
import { toastOptions } from "../.."
import { registerRoute } from "../../utils/APIRoutes"

export const registerAction = async ({ request }) => {
  //* Get the Form Data into a JS Object
  const formData = await request.formData()
  const actionData = Object.fromEntries(formData.entries())
  const { username, email, password, repassword } = actionData

  //* Validate the data
  let invalid = false
  if (!username) {
    toast.error("Username is required", toastOptions)
    invalid = true
  }
  if (username.length < 3) {
    toast.error("Username must be at least 3 characters", toastOptions)
    invalid = true
  }
  if (!email) {
    toast.error("Email is required", toastOptions)
    invalid = true
  }
  if (password.length < 5) {
    toast.error("Password must be at least 5 characters", toastOptions)
    invalid = true
  }
  if (password !== repassword) {
    toast.error("Passwords do not match", toastOptions)
    invalid = true
  }
  if (invalid) return null

  //* Send the data to the server
  const { data } = await axios.post(registerRoute, {
    username,
    email,
    password,
  })
  const { status, message, user } = data
  if (!status) toast.error(message, toastOptions)
  else {
    toast.success(message, toastOptions)
    localStorage.setItem("chat-app-user", JSON.stringify(user))
    return redirect("/setAvatar")
  }

  return null
}
