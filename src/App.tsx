import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import MainApp from './MainApp'
import SearchResults from './SearchResults'
import Auth from './Auth'

export interface User {
  id: string
  username: string
}

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  const handleLogin = (username: string, password: string) => {
    // In a real app, you'd validate credentials against a backend
    const newUser: User = { id: Date.now().toString(), username }
    setUser(newUser)
  }

  const handleSignup = (username: string, password: string) => {
    // In a real app, you'd send this data to a backend to create a new user
    const newUser: User = { id: Date.now().toString(), username }
    setUser(newUser)
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={
          user ? <Navigate to="/" replace /> : <Auth onLogin={handleLogin} onSignup={handleSignup} />
        } />
        <Route path="/search" element={
          user ? <SearchResults /> : <Navigate to="/auth" replace />
        } />
        <Route path="/" element={
          user ? <MainApp user={user} onLogout={handleLogout} /> : <Navigate to="/auth" replace />
        } />
      </Routes>
    </Router>
  )
}

export default App