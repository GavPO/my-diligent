import { Outlet, redirect, useNavigation } from "react-router-dom"
import tw from "twin.macro"
import Loader from "./assets/loader.gif"

export default function App() {
  const { state } = useNavigation()
  return state === "loading" ? (
    <Loading>
      <Gif src={Loader} alt="Loading" />
    </Loading>
  ) : (
    <Outlet />
  )
}

const Loading = tw.div`w-screen h-screen flex justify-center items-center bg-[#131324]`
const Gif = tw.img`w-96 h-96`

export const appLoader = () => {
  //* If there is a user logged in, direct to /
  if (localStorage.getItem("chat-app-user")) return redirect("/")
  return redirect("/login")
}
