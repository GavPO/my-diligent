import axios from "axios"
import { redirect } from "react-router-dom"
import { toast } from "react-toastify"
import { toastOptions } from "../.."
import { setAvatarRoute } from "../../utils/APIRoutes"
import { convertBlobToBase64 } from "../../utils/convert"

export const setAvatarLoader = async () => {
  const user = await JSON.parse(localStorage.getItem("chat-app-user"))
  if (user.isAvatarImageSet) return redirect("/")

  const api = "https://api.multiavatar.com/"
  const images = await Promise.all(
    [...Array(4)].map(async (_, i) => {
      const { data } = await axios.get(
        `${api}/${Math.round(Math.random() * 1000)}`
      )
      const blob = new Blob([data], { type: "image/svg+xml" })
      return await convertBlobToBase64(blob)
    })
  )

  //* Images as Base64
  return images
}

export const setAvatarAction = async ({ request }) => {
  const formData = await request.formData()
  const actionData = Object.fromEntries(formData.entries())
  if (!actionData.avatar) {
    toast.error("Please select an avatar", toastOptions)
    return null
  }

  const user = await JSON.parse(localStorage.getItem("chat-app-user"))
  const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
    avatarImage: actionData.avatar,
  })
  if (data.status) {
    localStorage.setItem("chat-app-user", JSON.stringify(data.user))
    return redirect("/")
  }
  toast.error("Error setting you Avatar. Try again.", toastOptions)
  return null
}
