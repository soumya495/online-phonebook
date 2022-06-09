import Navbar from '../Navbar'
import { NavLink, useNavigate } from 'react-router-dom'
import SocialLogin from '../SocialLogin'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { createUserWithEmailAndPassword } from '@firebase/auth'
import { auth } from '../../firebase'

function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const { email, password, confirmPassword } = formData

  const navigate = useNavigate()

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.warn('Passwords do not match')
      return
    }
    console.log('Sign Up Data: ', formData)

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      toast.success(`Sign Up Successful`)
      navigate('/profile')
    } catch (error) {
      toast.error(error.message)
    }

    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
    })
  }

  return (
    <div className='container'>
      <Navbar />
      <div className='form-wrapper'>
        <div className='center'>
          <h1>Sign Up</h1>
          <form onSubmit={handleOnSubmit}>
            <div className='txt_field'>
              <input
                type='email'
                id='email'
                autoComplete='new-password'
                value={email}
                onChange={handleOnChange}
                required
              />
              <span />
              <label>Email</label>
            </div>
            <div className='txt_field'>
              <input
                type='password'
                id='password'
                autoComplete='new-password'
                value={password}
                onChange={handleOnChange}
                required
              />
              <span />
              <label>Password</label>
            </div>
            <div className='txt_field'>
              <input
                type='password'
                id='confirmPassword'
                autoComplete='new-password'
                value={confirmPassword}
                onChange={handleOnChange}
                required
              />
              <span />
              <label>Confirm Password</label>
            </div>
            <input type='submit' defaultValue='Sign-Up' />
            <div className='signup_link'>
              Already Have an Account? <NavLink to='/log-in'>Log In</NavLink>
            </div>
          </form>
          <SocialLogin />
        </div>
      </div>
    </div>
  )
}

export default SignUp
