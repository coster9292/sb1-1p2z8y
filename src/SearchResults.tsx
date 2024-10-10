import React from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Hash } from 'lucide-react'

interface Channel {
  id: number
  name: string
  isPublic: boolean
  ownerId: string
}

function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  // In a real app, you'd fetch this data from a backend or global state
  const channels: Channel[] = [
    { id: 1, name: 'general', isPublic: true, ownerId: 'system' },
    { id: 2, name: 'random', isPublic: true, ownerId: 'system' },
    // Add more channels as needed
  ]

  const filteredChannels = channels.filter(
    channel => channel.isPublic && channel.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-800 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>
      <Link to="/" className="text-blue-400 hover:underline mb-6 block">← Back to Chat</Link>
      <div className="space-y-4">
        {filteredChannels.length > 0 ? (
          filteredChannels.map(channel => (
            <div key={channel.id} className="bg-gray-700 p-4 rounded-lg">
              <Link to="/" className="flex items-center space-x-2 text-xl font-semibold hover:text-blue-400">
                <Hash className="w-6 h-6" />
                <span>{channel.name}</span>
              </Link>
            </div>
          ))
        ) : (
          <p>No channels found matching your search.</p>
        )}
      </div>
    </div>
  )
}

export default SearchResults