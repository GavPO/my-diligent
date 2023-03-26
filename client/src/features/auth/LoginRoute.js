import axios from "axios"
import { redirect } from "react-router-dom"
import { toast } from "react-toastify"
import { toastOptions } from "../.."
import { loginRoute } from "../../utils/APIRoutes"

export const loginAction = async ({ request }) => {
  //* Get the Form Data into a JS Object
  const formData = await request.formData()
  const actionData = Object.fromEntries(formData.entries())
  const { usernameOrEmail, password } = actionData

  //* Validate the data
  let invalid = false
  if (!usernameOrEmail) {
    toast.error("Username or Email is required", toastOptions)
    invalid = true
  }
  if (!password) {
    toast.error("Password is required", toastOptions)
    invalid = true
  }
  if (invalid) return null

  //* Send the data to the server
  const { data } = await axios.post(loginRoute, {
    usernameOrEmail,
    password,
  })
  const { status, message, user } = data
  if (!status) toast.error(message, toastOptions)
  else {
    toast.success(message, toastOptions)
    localStorage.setItem("chat-app-user", JSON.stringify(user))
    return redirect("/")
  }

  return null
}
