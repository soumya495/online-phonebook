import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth'
import React from 'react'
import { FaGoogle } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { auth } from '../firebase'
import { useNavigate } from 'react-router'

function SocialLogin() {
  const googleProvider = new GoogleAuthProvider()
  const navigate = useNavigate()

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/profile')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <>
      <p className='social-text'>Or</p>
      <div className='social-login' onClick={signInWithGoogle}>
        <FaGoogle /> Sign In With Google
      </div>
    </>
  )
}

export default SocialLogin
