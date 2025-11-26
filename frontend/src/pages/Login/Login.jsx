import './Login.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import loginService from '../../services/login'

const Login = ({setUser}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({username, password})
      toast.success('Login successful!')

      setUser(user)
      navigate('/')
    } catch (error) {
      toast.error('Wrong credentials')
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>Username</div>
      <div>
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>Password</div>
      <div>
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <div>
        <button type="submit">Log in</button>
      </div>
    </form>
  )

  return (
    <div className="loginWrapper">
      <button onClick={() => setUser(null)}>reset session storage</button>
      <div className="loginContainer">
        <h1>Login</h1>
        {loginForm()}
      </div>
      <div>
        <Link to="/register">Create Account</Link>
      </div>
    </div>
  )
}

export default Login