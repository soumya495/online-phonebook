import { NavLink, useNavigate } from 'react-router-dom'
import Navbar from '../Navbar'
import SocialLogin from '../SocialLogin'
import { useState } from 'react'
import { toast } from 'react-toastify'
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from '@firebase/auth'
import { auth } from '../../firebase'

function LogIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

  const navigate = useNavigate()

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()

    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success(`Logged in Successfully`)
      navigate('/profile')
    } catch (error) {
      toast.error(error.message)
    }

    console.log('Login Data: ', formData)
    setFormData({
      email: '',
      password: '',
    })
  }

  const handlePasswordReset = async () => {
    if (!email) {
      toast.error('Please fill the email')
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success(`Reset link sent`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className='container'>
      <Navbar />
      <div className='form-wrapper'>
        <div className='center'>
          <h1>Login</h1>
          <form onSubmit={handleOnSubmit}>
            <div className='txt_field'>
              <input
                autoComplete='new-password'
                id='email'
                type='text'
                value={email}
                onChange={handleOnChange}
                required
              />
              <span />
              <label>Email</label>
            </div>
            <div className='txt_field'>
              <input
                autoComplete='new-password'
                id='password'
                type='password'
                value={password}
                onChange={handleOnChange}
                required
              />
              <span />
              <label>Password</label>
            </div>
            <div className='pass' onClick={handlePasswordReset}>
              Forgot Password?
            </div>
            <input type='submit' defaultValue='Login' />
            <div className='signup_link'>
              Not a member? <NavLink to='/sign-up'>Sign up</NavLink>
            </div>
          </form>
          {/* <SocialLogin /> */}
        </div>
      </div>
    </div>
  )
}

export default LogIn
