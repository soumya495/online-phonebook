import Navbar from '../Navbar'
import { NavLink, useNavigate } from 'react-router-dom'
import SocialLogin from '../SocialLogin'
import { useState } from 'react'
import { toast } from 'react-toastify'
import FileBase from 'react-file-base64'
import { createUserWithEmailAndPassword } from '@firebase/auth'
import { auth, db } from '../../firebase'
import { addDoc, collection } from '@firebase/firestore'
import Loading from '../Loading'

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    facebookLink: '',
    instagramLink: '',
    linkedInLink: '',
    imageData: '',
  })
  const [loading, setLoading] = useState(false)

  const {
    name,
    email,
    phoneNumber,
    password,
    confirmPassword,
    facebookLink,
    instagramLink,
    linkedInLink,
    imageData,
  } = formData

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

    setLoading(true)

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const colRef = collection(db, 'users')
      setLoading(true)
      await addDoc(colRef, {
        id: result.user.uid,
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        facebookLink: facebookLink,
        instagramLink: instagramLink,
        linkedInLink: linkedInLink,
        imageData: imageData,
      })
      setLoading(false)
      toast.success(`Sign Up Successful`)
      navigate('/profile')
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      setLoading(false)
    }

    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      facebookLink: '',
      instagramLink: '',
      linkedInLink: '',
      imageData: '',
    })
  }

  return (
    <div className='container'>
      <Navbar />
      {loading && <Loading />}
      <div className='form-wrapper sign-up-wrapper'>
        <div className='center'>
          <h1>Sign Up</h1>
          <form onSubmit={handleOnSubmit}>
            <div className='user-details'>
              <div className='input-box'>
                <input
                  type='text'
                  id='name'
                  autoComplete='new-password'
                  value={name}
                  onChange={handleOnChange}
                  required
                />
                <span />
                <label className='details'>Name*</label>
              </div>
              <div className='input-box'>
                <input
                  type='email'
                  id='email'
                  autoComplete='new-password'
                  value={email}
                  onChange={handleOnChange}
                  required
                />
                <span />
                <label className='details'>Email*</label>
              </div>
              <div className='input-box'>
                <input
                  type='tel'
                  id='phoneNumber'
                  autoComplete='new-password'
                  value={phoneNumber}
                  onChange={handleOnChange}
                  required
                />
                <span />
                <label className='details'>Phone Number*</label>
              </div>
              <div className='input-box'>
                <input
                  type='password'
                  id='password'
                  autoComplete='new-password'
                  value={password}
                  onChange={handleOnChange}
                  required
                />
                <span />
                <label className='details'>Password*</label>
              </div>
              <div className='input-box'>
                <input
                  type='password'
                  id='confirmPassword'
                  autoComplete='new-password'
                  value={confirmPassword}
                  onChange={handleOnChange}
                  required
                />
                <span />
                <label className='details'>Confirm Password*</label>
              </div>
              <div className='input-box'>
                <input
                  type='url'
                  id='facebookLink'
                  autoComplete='new-password'
                  value={facebookLink}
                  onChange={handleOnChange}
                />
                <span />
                <label className='details'>Facebook Link</label>
              </div>
              <div className='input-box'>
                <input
                  type='url'
                  id='instagramLink'
                  autoComplete='new-password'
                  value={instagramLink}
                  onChange={handleOnChange}
                />
                <span />
                <label className='details'>Instagram Link</label>
              </div>
              <div className='input-box'>
                <input
                  type='url'
                  id='linkedInLink'
                  autoComplete='new-password'
                  value={linkedInLink}
                  onChange={handleOnChange}
                />
                <span />
                <label className='details'>LinkedIn Link</label>
              </div>
              <div className='input-box'>
                <FileBase
                  type='file'
                  multiple={false}
                  onDone={({ base64 }) =>
                    setFormData({ ...formData, imageData: base64 })
                  }
                />

                <label className='details'>Upload Photo</label>
              </div>
            </div>
            <div className='full-width'>
              <input type='submit' defaultValue='Sign-Up' />
            </div>
            <div className='signup_link'>
              Already Have an Account? <NavLink to='/log-in'>Log In</NavLink>
            </div>
          </form>
          {/* <SocialLogin /> */}
        </div>
      </div>
    </div>
  )
}

export default SignUp
