import './Register.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import registerService from '../../services/register'

const Register = () => {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegistration = async (event) => {
    event.preventDefault()
    
    try {
      await registerService.register({username, name, password})
      toast.success('Registration successful! Please log in.')

      navigate('/login')
    } catch (error) {
      toast.error('Wrong credentials')
    }
  }

  const registerForm = () => (
    <form onSubmit={handleRegistration}>
      <div>Username</div>
      <div>
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>Name</div>
      <div>
        <input
          type="text"
          value={name}
          name="Name"
          onChange={({ target }) => setName(target.value)}
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
        <button type="submit">Register</button>
      </div>
    </form>
  )

  return (
    <div className="loginWrapper">
      <div className="loginContainer">
        <h1>Register</h1>
        {registerForm()}
      </div>
      <div>
        <Link to="/login">Already have an account?</Link>
      </div>
    </div>
  )
}

export default Register