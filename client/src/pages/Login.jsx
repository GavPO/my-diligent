import { Form, NavLink } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import tw from "twin.macro"
import Logo from "../assets/logo.svg"

export default function Login() {
  return (
    <>
      <FormContainer>
        <StyledForm action="/login" method="post">
          <Header>
            <Image src={Logo} alt="logo" />
            <Title>Diligent</Title>
          </Header>
          <Input
            type="text"
            name="usernameOrEmail"
            placeholder="Username or Email"
          />
          <Input type="password" name="password" placeholder="Password" />
          <Button type="submit">Login</Button>
          <TogglePage>
            Don't have an account? <Link to="/register">Register</Link>
          </TogglePage>
        </StyledForm>
      </FormContainer>
      <ToastContainer />
    </>
  )
}

const FormContainer = tw.div`h-screen w-screen flex flex-col justify-center items-center gap-4 bg-[#131324]`
const Header = tw.header`flex justify-center items-center gap-4 mb-10`
const Image = tw.img`h-16`
const Title = tw.h1`text-5xl text-neutral-50 uppercase`
const StyledForm = tw(
  Form
)`flex flex-col justify-center items-center gap-6 bg-[#00000076] rounded-2xl shadow-lg px-8 py-6 md:px-32 md:py-24`
const Input = tw.input`bg-transparent p-4 border border-[#4e0eff] rounded-lg text-neutral-50 w-full text-lg focus:(border-[#997af0] outline-none)`
const Button = tw.button`bg-[#997af0] w-full text-white px-2 py-4 font-bold cursor-pointer rounded-lg uppercase text-lg transition-all hover:bg-[#4e0eff]`
const TogglePage = tw.span`text-neutral-50 uppercase`
const Link = tw(NavLink)`underline text-[#4e0eff]`
