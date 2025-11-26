import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Orders from './pages/Orders/Orders'

const App = () => {
  const [user, setUser] = useState(() => {
    return JSON.parse(sessionStorage.getItem('loggedInUser')) || null
  })

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('loggedInUser', JSON.stringify(user))
    } else {
      sessionStorage.removeItem('loggedInUser')
    }
  }, [user])

  // //for testing
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log(user)
  //   }, 2000)

  //   return () => clearInterval(interval)
  // }, [user]) 
  // //for testing
  

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<Orders user={user} setUser={setUser}/>} />
        <Route path="/login" element={<Login setUser={setUser}/>} />
        <Route path="/register" element={<Register/>} />
      </Routes>
    </Router>
  )
}

export default App