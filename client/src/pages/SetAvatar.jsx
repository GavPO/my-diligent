import { useState } from "react"
import { Form, useLoaderData } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import tw, { styled } from "twin.macro"

export default function SetAvatar() {
  const images = useLoaderData()

  const [selected, select] = useState(-1)

  return (
    <>
      <Wrapper>
        <Title>Choose your Avatar</Title>
        <StyledForm method="post">
          <AvatarsContainer>
            {images.map((image, index) => (
              <Image
                key={image}
                selected={selected === index}
                onClick={() => select(index)}
                src={image}
                alt="avatar"
              />
            ))}
          </AvatarsContainer>
          <input
            type="hidden"
            name="avatar"
            value={JSON.stringify(images[selected])}
          />
          <Button type="submit">Set Avatar</Button>
        </StyledForm>
        <P>You can refresh the page for new ones</P>
      </Wrapper>
      <ToastContainer />
    </>
  )
}

const Wrapper = tw.div`h-screen w-screen flex flex-col justify-center items-center gap-4 bg-[#131324]`
const Title = tw.h1`text-7xl text-center text-neutral-50`
const StyledForm = tw(
  Form
)`flex flex-col justify-center items-center gap-10 bg-[#00000076] rounded-2xl shadow-lg px-8 py-6 md:px-32 md:py-24`
const AvatarsContainer = tw.div`flex justify-center items-center gap-4`
const Image = styled.img(({ selected }) => [
  tw`h-32 p-2`,
  selected && tw`border-4 rounded-full border-[#4e0eff]`,
])
const Button = tw.button`bg-[#997af0] w-full text-white px-2 py-4 font-bold cursor-pointer rounded-lg uppercase text-lg transition-all hover:bg-[#4e0eff]`
const P = tw.p`text-neutral-50`
