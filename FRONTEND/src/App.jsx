


import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import CommentsPage from './pages/CommentsPage'
import Profile from './pages/Profile'

const App = () => {
  const [posts, setPosts] = useState([])

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/feed" element={<Feed posts={posts} setPosts={setPosts} />} />
      <Route path="/comments/:postId" element={<CommentsPage posts={posts} setPosts={setPosts} />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

export default App

