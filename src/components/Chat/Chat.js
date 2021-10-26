import React, { useState, useEffect } from 'react'
//import { useHistory } from 'react-router-dom'
import io from 'socket.io-client'

import InfoBar from '../InfoBar/InfoBar'
import Messages from '../Messages/Messages'
import Input from '../Input/Input'
import TextContainer from '../TextContainer/TextContainer'

import './Chat.css'

let socket

const Chat = () => {
  //let history = useHistory()

  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [users, setUsers] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const ENDPOINT = 'localhost:5000'

  useEffect(() => {
    const name = localStorage.getItem('userName')
    const room = localStorage.getItem('room')

    socket = io(ENDPOINT, { transports: ['websocket'] })

    setName(name)
    setRoom(room)

    socket.emit('join', { name, room }, () => {})
    console.log(socket)

    return () => {
      socket.emit('disconnect')

      socket.off()
    }
  }, [ENDPOINT])

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message])
    })

    socket.on('roomData', ({ users }) => {
      setUsers(users)
    })
  }, [messages])

  const sendMessage = (event) => {
    event.preventDefault()

    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''))
    }
  }

  console.log(message, messages)

  return (
    <div className="chatBox">
      <div className="chatContainer">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  )
}

export default Chat