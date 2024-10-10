import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, Hash, User, Send, Plus, Search, Trash2, LogOut } from 'lucide-react'
import { User as UserType } from './App'

interface Message {
  id: number
  user: string
  content: string
}

interface Channel {
  id: number
  name: string
  isPublic: boolean
  ownerId: string
}

interface ChannelMessages {
  [channelId: number]: Message[]
}

const initialChannels: Channel[] = [
  { id: 1, name: 'general', isPublic: true, ownerId: 'system' },
  { id: 2, name: 'random', isPublic: true, ownerId: 'system' },
]

const initialChannelMessages: ChannelMessages = {
  1: [
    { id: 1, user: 'User1', content: 'Hello, everyone in general!' },
    { id: 2, user: 'User2', content: 'Hi there! How are you all doing in general?' },
  ],
  2: [
    { id: 1, user: 'User3', content: 'Random channel, random messages!' },
    { id: 2, user: 'User4', content: 'I love random conversations!' },
  ],
}

interface MainAppProps {
  user: UserType
  onLogout: () => void
}

function MainApp({ user, onLogout }: MainAppProps) {
  const [channels, setChannels] = useState<Channel[]>(() => {
    const storedChannels = localStorage.getItem('channels')
    return storedChannels ? JSON.parse(storedChannels) : initialChannels
  })
  const [channelMessages, setChannelMessages] = useState<ChannelMessages>(() => {
    const storedMessages = localStorage.getItem('channelMessages')
    return storedMessages ? JSON.parse(storedMessages) : initialChannelMessages
  })
  const [currentChannel, setCurrentChannel] = useState<Channel>(channels[0])
  const [newMessage, setNewMessage] = useState('')
  const [newChannel, setNewChannel] = useState('')
  const [showNewChannelForm, setShowNewChannelForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem('channels', JSON.stringify(channels))
  }, [channels])

  useEffect(() => {
    localStorage.setItem('channelMessages', JSON.stringify(channelMessages))
  }, [channelMessages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const message: Message = {
        id: (channelMessages[currentChannel.id]?.length || 0) + 1,
        user: user.username,
        content: newMessage.trim(),
      }
      setChannelMessages(prev => ({
        ...prev,
        [currentChannel.id]: [...(prev[currentChannel.id] || []), message]
      }))
      setNewMessage('')
    }
  }

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault()
    if (newChannel.trim()) {
      const channel: Channel = {
        id: Date.now(),
        name: newChannel.trim(),
        isPublic: true,
        ownerId: user.id,
      }
      setChannels(prev => [...prev, channel])
      setChannelMessages(prev => ({...prev, [channel.id]: []}))
      setNewChannel('')
      setShowNewChannelForm(false)
    }
  }

  const handleDeleteChannel = (channelId: number) => {
    setChannels(prev => prev.filter(channel => channel.id !== channelId))
    setChannelMessages(prev => {
      const { [channelId]: _, ...rest } = prev
      return rest
    })
    if (currentChannel.id === channelId) {
      setCurrentChannel(channels[0])
    }
  }

  const handleChannelClick = (channel: Channel) => {
    setCurrentChannel(channel)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white">
      {/* Search bar and user info */}
      <div className="bg-gray-900 p-4 flex justify-between items-center">
        <form onSubmit={handleSearch} className="flex items-center flex-grow mr-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for channels"
            className="flex-grow bg-gray-700 text-white rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 rounded-r p-2"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
        <div className="flex items-center">
          <span className="mr-4">{user.username}</span>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 rounded p-2"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 flex flex-col">
          <div className="p-4 text-xl font-bold">Discord-like App</div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className={`flex items-center justify-between p-2 hover:bg-gray-700 rounded cursor-pointer ${
                    currentChannel.id === channel.id ? 'bg-gray-700' : ''
                  }`}
                >
                  <div
                    className="flex items-center space-x-2"
                    onClick={() => handleChannelClick(channel)}
                  >
                    <Hash className="w-5 h-5" />
                    <span>{channel.name}</span>
                  </div>
                  {channel.ownerId === user.id && (
                    <button
                      onClick={() => handleDeleteChannel(channel.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {showNewChannelForm ? (
              <form onSubmit={handleCreateChannel} className="p-2">
                <input
                  type="text"
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value)}
                  placeholder="New channel name"
                  className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </form>
            ) : (
              <button
                onClick={() => setShowNewChannelForm(true)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded cursor-pointer w-full"
              >
                <Plus className="w-5 h-5" />
                <span>Add Channel</span>
              </button>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Channel name */}
          <div className="bg-gray-700 p-4 font-bold">
            <Hash className="w-5 h-5 inline-block mr-2" />
            {currentChannel.name}
          </div>

          {/* Chat area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {channelMessages[currentChannel.id]?.map((message) => (
              <div key={message.id} className="flex items-start space-x-2">
                <User className="w-8 h-8 bg-gray-600 rounded-full p-1" />
                <div>
                  <span className="font-bold">{message.user}</span>
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-gray-700">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message #${currentChannel.name}`}
                className="flex-1 bg-gray-600 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 rounded p-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default MainApp