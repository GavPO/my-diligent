import { useRouteError } from "react-router-dom"

export default function RouteError() {
  const error = useRouteError()
  console.error("Route Error: ", error)
  return (
    <>
      <h1>Route Error</h1>
      <p>{error.message}</p>
    </>
  )
}
