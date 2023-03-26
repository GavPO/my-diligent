import tw from "twin.macro"
import Robot from "../assets/robot.gif"

export default function Welcome({ username }) {
  return (
    <Wrapper>
      <Image src={Robot} alt="Robot Welcome" />
      <Message>
        Welcome, <PurpleText>{username}!</PurpleText>
      </Message>
      <SubMessage>Start chatting with someone!</SubMessage>
    </Wrapper>
  )
}

const Wrapper = tw.div`flex flex-col h-full items-center justify-center gap-4 -translate-y-16`
const Image = tw.img`h-64`
const Message = tw.h1`text-white text-4xl md:text-5xl`
const PurpleText = tw.span`text-[#4e0eff]`
const SubMessage = tw.h2`text-white text-2xl md:text-3xl`
