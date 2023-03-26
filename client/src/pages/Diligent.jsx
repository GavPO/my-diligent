import { useEffect, useRef, useState } from 'react'
import { NavLink, useLoaderData, useSubmit } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import tw, { styled } from 'twin.macro'
import { getAvatar } from '../utils/getAvatar'
import Logo from '../assets/logo.svg'
import Welcome from '../components/Welcome'
import Feed from '../components/Feed'
import Duck from '../assets/the-duck.png'
import Picker from 'emoji-picker-react'
import { BsEmojiSmileFill } from 'react-icons/bs'
import useOnClickOutside from '../hooks/useOnClickOutside'
import axios from 'axios'
import { getMessagesRoute, host } from '../utils/APIRoutes'
import { io } from 'socket.io-client'
import { convertBlobToBase64 } from '../utils/convert'
import reduceImageFileSize from '../utils/reduceImageFileSize'

const socket = io(host)

export default function Diligent() {
  const submit = useSubmit()
  const { user, users } = useLoaderData()

  const findUser = id => users.find(user => user._id === id)

  const [notifications, setNotifications] = useState([])

  //* Socket Connection
  useEffect(() => {
    if (!user) return
    socket.emit('add-user', user._id)
    return () => socket.emit('remove-user', user._id)
  }, [user])

  //* Notifications
  const showNotification = (title, options) => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission()
    } else {
      new Notification(title, options)
    }
  }

  //* Recieve Socket Message
  useEffect(() => {
    Notification.requestPermission()

    const handleMessage = msgg => {
      const { to, message, from, image } = msgg
      const user = findUser(from)
      if (to === 'c:GENERAL' && focusedUser !== 'c:GENERAL')
        setNotifications(curr => [...curr, 'GENERAL'])
      else if (user !== focusedUser) setNotifications(curr => [...curr, from])
      showNotification(user.username, {
        body: message,
      })
      if (focusedUser !== 'c:GENERAL' && to === 'c:GENERAL') return
      if (focusedUser._id !== from) return
      setFeed(curr =>
        !curr ? curr : [...curr, { fromSelf: false, message, image }]
      )
    }

    socket.on('receive-message', handleMessage)
    return () => socket.off('receive-message', handleMessage)
  }, [])

  //* User and Chat Data State
  const [focusedUser, openChatWith] = useState(null)
  const [feed, setFeed] = useState(null)

  //* Change Feed on Focus Change
  useEffect(() => {
    if (!focusedUser) return
    if (typeof focusedUser === 'object')
      setNotifications(curr => curr.filter(id => id !== focusedUser._id))
    else setNotifications(curr => curr.filter(id => id !== 'GENERAL'))

    const fetchMessages = async () => {
      const { data } = await axios.post(getMessagesRoute, {
        from: user,
        to: focusedUser,
      })
      setFeed(data)
    }
    fetchMessages()
  }, [focusedUser, user])

  //* Send Message
  const [screenshot, setScreenshot] = useState(undefined)
  const [message, setMessage] = useState('')
  const onChange = e => setMessage(e.target.value)

  const send = () => {
    if (!message && !screenshot) return

    submit(
      {
        message,
        image: screenshot,
        from: JSON.stringify(user),
        to: JSON.stringify(focusedUser),
      },
      { method: 'post' }
    )
    socket.emit('send-message', {
      to: typeof focusedUser === 'string' ? focusedUser : focusedUser._id,
      from: user._id,
      message,
      image: screenshot,
    })
    setFeed(curr => [...curr, { fromSelf: true, message, image: screenshot }])
    setTimeout(() => setMessage(''))
    setScreenshot(undefined)
  }

  //* Emoji Picker
  const pickerRef = useRef()
  const [showEmojiPicker, setEmojiPicker] = useState(false)
  const openEmojiPicker = () => setEmojiPicker(curr => !curr)
  const onEmojiClick = ({ emoji }, event) => {
    setMessage(curr => (curr += emoji))
  }
  useOnClickOutside(pickerRef, e => {
    setEmojiPicker(false)
  })

  //* Auto Resize TextArea Logic
  const autoResize = useRef()
  useEffect(() => {
    if (!autoResize.current) return
    autoResize.current.style.height = null
    autoResize.current.style.height = autoResize.current.scrollHeight + 'px'
  }, [message])

  //* Start Scroll to Bottom on Focused User Change
  const feedRef = useRef()
  useEffect(() => {
    if (!feedRef.current) return
    const timeout = setTimeout(
      () => (feedRef.current.scrollTop = feedRef.current.scrollHeight),
      10
    )
    return () => clearTimeout(timeout)
  }, [focusedUser])

  //* ScreenShots
  const handlePaste = async e => {
    const clipboardItems = e.clipboardData.items
    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i]
      if (item.type.indexOf('image') === -1) continue
      const blob = item.getAsFile()
      const reducedFileSize = await reduceImageFileSize(blob)
      const base64 = await convertBlobToBase64(reducedFileSize)
      setScreenshot(base64)
      autoResize.current.focus()
    }
  }

  return (
    <>
      <Container>
        <Left>
          <LoggedInUser>
            <Avatar src={getAvatar(user.avatarImage)} alt='avatar' />
            <Name>{user.username}</Name>
            <Logout to='/logout'>Logout</Logout>
          </LoggedInUser>
          <Title>Contacts</Title>
          <Contacts>
            <Contact as={`a`} href='https:/chat.openai.com' target='_blank'>
              <DuckAvatar color={1} src={Duck} alt='chatGPT' />
              <Name>The Duck</Name>
            </Contact>
            <Contact
              selected={focusedUser === 'c:GENERAL'}
              onClick={() => openChatWith('c:GENERAL')}
            >
              <DuckAvatar src={Logo} alt='c:GENERAL' />
              <FlexBetween>
                <Name>General</Name>
                {notifications.includes('GENERAL') && <Bubble />}
              </FlexBetween>
            </Contact>
            {users.map(user => {
              const { avatarImage, username, _id } = user
              return (
                <Contact
                  key={_id}
                  selected={_id === focusedUser?._id}
                  onClick={() => openChatWith(user)}
                >
                  <Avatar src={getAvatar(avatarImage)} alt='avatar' />
                  <FlexBetween>
                    <Name>{username}</Name>
                    {notifications.includes(_id) && <Bubble />}
                  </FlexBetween>
                </Contact>
              )
            })}
          </Contacts>
        </Left>
        <Right>
          {!focusedUser ? (
            <Welcome username={user.username} />
          ) : (
            <Chat>
              <ChatHeader>
                <Title>Chat Room</Title>
                <UserDetails>
                  {focusedUser === 'c:GENERAL' ? (
                    <DuckAvatar src={Logo} alt='c:GENERAL' />
                  ) : (
                    <Avatar
                      src={getAvatar(focusedUser.avatarImage)}
                      alt='avatar'
                    />
                  )}
                  <Name>
                    {focusedUser === 'c:GENERAL'
                      ? 'c:GENERAL'
                      : focusedUser.username}
                  </Name>
                </UserDetails>
              </ChatHeader>
              <Feed feed={feed} ref={feedRef} />
              <ChatInputBox>
                {showEmojiPicker && (
                  <PickerWrapper ref={pickerRef}>
                    <Picker onEmojiClick={onEmojiClick} />
                  </PickerWrapper>
                )}
                <EmojiButton
                  open={showEmojiPicker}
                  className={showEmojiPicker && 'pointer-events-none'}
                  onClick={openEmojiPicker}
                >
                  <BsEmojiSmileFill />
                </EmojiButton>

                <EmojiButton>
                  {screenshot ? (
                    <SCImage>
                      <X onClick={() => setScreenshot(undefined)}>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke-width='1.5'
                          stroke='currentColor'
                          class='w-6 h-6'
                        >
                          <path
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            d='M6 18L18 6M6 6l12 12'
                          />
                        </svg>
                      </X>
                      <img src={screenshot} alt='screenshot' />
                    </SCImage>
                  ) : (
                    <ScreenShotBox
                      placeholder='SC'
                      value=''
                      onPaste={handlePaste}
                    />
                  )}
                </EmojiButton>

                <ChatInput
                  value={message}
                  onChange={onChange}
                  onKeyDown={e => !e.shiftKey && e.key === 'Enter' && send()}
                  ref={autoResize}
                  type='text'
                  placeholder='Message...'
                />
                <SendButton onClick={send}>Send</SendButton>
              </ChatInputBox>
            </Chat>
          )}
        </Right>
      </Container>
      <ToastContainer />
    </>
  )
}

const Container = tw.div`grid [grid-template-columns: 35% 65%;] lg:[grid-template-columns: 25% 75%;] h-screen w-screen bg-[#00000076]`

const Left = tw.div`h-screen bg-[#080420] py-6`
const LoggedInUser = tw.div`flex items-center gap-4 bg-blue-800 rounded-xl mb-8 mx-4`
const Title = tw.h1`text-white text-5xl px-4`
const Contacts = tw.div`flex flex-col h-[calc(100vh - 48px - 80px - 64px)] gap-4 overflow-y-auto mb-4 px-4 [&::-webkit-scrollbar]:(w-1 bg-[#080420] rounded-xl) [&::-webkit-scrollbar-thumb]:(bg-[#997ae5]/50 rounded-xl hover:(bg-[#997af0]))`
const Contact = styled.div(({ selected }) => [
  tw`flex items-center gap-4 cursor-pointer bg-[#131324] hover:bg-[#997ae5]/50 px-4 py-2 rounded-xl`,
  selected && tw`bg-[#997af0] hover:(bg-[#997ae5] brightness-110)`,
])
const Avatar = tw.img`h-20 p-2`
const DuckAvatar = styled.img(({ color }) => [
  tw`ml-1.5 h-16 p-2 rounded-full bg-red-800`,
  color && tw`bg-[#425ffe]`,
])
const Name = tw.p`text-white text-xl`
const Logout = tw(NavLink)`text-white text-xl underline ml-auto mr-4`

const Right = tw.div`h-screen bg-[#080420] pt-6 `
const Chat = tw.main`h-full relative`
const ChatHeader = tw.header`flex justify-between px-10 items-center`
const UserDetails = tw.div`flex items-center gap-4 rounded-xl`
const ChatInputBox = tw.div`absolute bottom-0 left-0 right-0 flex items-end gap-4 px-10 py-2 rounded-t-xl bg-blue-800`
const EmojiButton = styled.button(({ open }) => [
  tw`relative box-border border-2 border-transparent bg-[#080420] rounded-lg p-2 [svg]:(text-yellow-500 w-6 h-6)`,
  open && tw`border-[#997ae5]`,
])
const PickerWrapper = tw.div`absolute bottom-16 left-0 w-80 right-0 `
const ChatInput = tw.textarea`w-full max-h-[20rem] h-12 rounded-xl px-4 py-2 outline-none resize-none bg-[#080420] text-white text-xl placeholder-[#997ae5] border-2 border-[#00000076] focus:(border-[#997af0]) [&::-webkit-scrollbar]:w-0`
const SendButton = tw.button`transition-all bg-[#131324] flex justify-center items-center border-2 border-transparent hover:(bg-[#080420] scale-[102%] border-[#997ae5]) text-white text-xl rounded-xl h-11 px-4 pt-2.5 pb-2`

const ScreenShotBox = tw.input`w-6 h-6 bg-transparent pl-0.5`
const SCImage = tw.div`relative`
const X = tw.button`absolute z-10 top-0 right-0 w-6 h-6 [svg]:text-white bg-red-400  rounded-full text-lg flex items-center justify-center transition-all ease-in-out hover:(bg-red-500 scale-[102%] shadow)`

const Bubble = tw.div`w-3 h-3 rounded-full bg-[#997ae5]`
const FlexBetween = tw.div`flex justify-between w-full items-center`
