import { forwardRef, useEffect, useRef } from 'react'
import tw, { styled } from 'twin.macro'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/hljs'

const Feed = forwardRef(({ feed }, ref) => {
  //* Scroll to Last Message
  const lastMessage = useRef()

  useEffect(() => {
    const timeout = setTimeout(
      () =>
        lastMessage.current &&
        lastMessage.current.scrollIntoView({ behavior: 'smooth' }),
      20
    )
    return () => clearTimeout(timeout)
  }, [feed])

  return (
    <StyledFeed ref={ref}>
      {feed?.map(({ fromSelf, message, image }, index) => {
        const isLastMessage = index === feed.length - 1
        const splitMessage = message.split('```')
        return splitMessage.map((msg, index) => {
          if (index % 2 === 0) {
            if (!msg)
              return (
                <img
                  ref={isLastMessage ? lastMessage : undefined}
                  src={image}
                  alt='screenshot'
                />
              )
            return (
              <>
                {/* {index === 0 && image && <img src={image} alt="screenshot" />} */}
                <Message
                  key={index}
                  ref={isLastMessage ? lastMessage : undefined}
                  fromSelf={fromSelf}
                >
                  {msg}
                </Message>
              </>
            )
          } else {
            return (
              <CodeWrapper
                ref={isLastMessage ? lastMessage : undefined}
                fromSelf={fromSelf}
              >
                <CodeContainer fromSelf={fromSelf}>
                  <SyntaxHighlighter language='javascript' style={nightOwl}>
                    {msg}
                  </SyntaxHighlighter>
                </CodeContainer>
              </CodeWrapper>
            )
          }
        })
      })}
    </StyledFeed>
  )
})

const StyledFeed = tw.div`h-[calc(100vh - 60px - 80px - 24px)] overflow-y-auto px-10 py-4 [&::-webkit-scrollbar]:(w-1 bg-[#080420] rounded-xl) flex flex-col gap-4 [&::-webkit-scrollbar-thumb]:(bg-[#997ae5]/50 rounded-xl hover:(bg-[#997af0]))`
const Message = styled.div(({ fromSelf }) => [
  tw`text-white flex whitespace-pre-wrap rounded-t-2xl p-4 [width: fit-content;] max-w-[80%]`,
  fromSelf
    ? tw`self-end bg-blue-800 rounded-l-2xl`
    : tw`self-start bg-[#997ae5] rounded-r-2xl`,
])
const CodeWrapper = styled.div(({ fromSelf }) => [
  tw`[width: fit-content;]  max-w-[80%]`,
  fromSelf && tw`ml-auto`,
])
const CodeContainer = styled.div(({ fromSelf }) => [
  tw`rounded-t-2xl overflow-hidden`,
  fromSelf ? tw`self-end rounded-l-2xl` : tw`self-start rounded-r-2xl`,
])

export default Feed
