import Navbar from '../Navbar'
import { NavLink, useNavigate } from 'react-router-dom'
import SocialLogin from '../SocialLogin'
import { useState } from 'react'
import { toast } from 'react-toastify'
import FileBase from 'react-file-base64'
import { createUserWithEmailAndPassword } from '@firebase/auth'
import { auth, db } from '../../firebase'
import { doc, setDoc } from '@firebase/firestore'
import Loading from '../Loading'
import { isImage } from '../../ValidImage'

import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

import { storage } from '../../firebase'

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
  // const [progress, setProgress] = useState(0)
  const [url, setUrl] = useState(null)
  const [fileUp, setFileUp] = useState(null)

  const handleUploadChange = () => {
    const file = document.getElementById('fileInpUser').files[0]
    if (!isImage(file)) {
      toast.error('Please upload image files')
      return
    }
    if (file) {
      setFileUp(file.name)
    }
  }

  const uploadFile = async (e) => {
    e.preventDefault()
    const file = document.getElementById('fileInpUser').files[0]
    console.log(file)

    if (!file) return
    const storageRef = ref(storage, `files/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prog =
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100
      },
      (err) => {
        console.log(err)
        toast('Not Uploaded')
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setUrl(url)
        })
      }
    )
  }

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

    if (fileUp && !url) {
      toast.warn('Wait for the image to upload')
      return
    }

    setLoading(true)

    try {
      setLoading(true)
      const result = await createUserWithEmailAndPassword(auth, email, password)

      await setDoc(doc(db, `users/${result.user.uid}`), {
        id: result.user.uid,
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        facebookLink: facebookLink,
        instagramLink: instagramLink,
        linkedInLink: linkedInLink,
        imageData: url,
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
              <div className='filebox'>
                {/* <FileBase
                  type='file'
                  multiple={false}
                  onDone={({ base64 }) =>
                    setFormData({ ...formData, imageData: base64 })
                  }
                /> */}
                <input
                  type='file'
                  id='fileInpUser'
                  onChange={handleUploadChange}
                />

                <button onClick={uploadFile} disabled={url ? true : false}>
                  {url ? 'Uploaded' : 'Upload Photo'}
                </button>
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
