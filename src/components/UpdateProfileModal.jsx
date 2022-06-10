import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import FileBase from 'react-file-base64'
import { auth, db } from '../firebase'
import { setDoc, doc } from '@firebase/firestore'
import Modal from './Modal'
import Loading from './Loading'

function UpdateProfileModal({ userData, open, setOpen, setLoading, getData }) {
  const [formData, setFormData] = useState({
    name: userData.name,
    phoneNumber: userData.phoneNumber,
    facebookLink: userData.facebookLink,
    instagramLink: userData.instagramLink,
    linkedInLink: userData.linkedInLink,
    imageData: userData.imageData,
  })

  const {
    name,
    phoneNumber,
    facebookLink,
    instagramLink,
    linkedInLink,
    imageData,
  } = formData

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()

    console.log('Sign Up Data: ', formData)

    const updatedData = {
      ...formData,
      id: userData.id,
      email: userData.email,
      imageData: imageData ?? userData.imageData,
    }

    setOpen(false)

    try {
      setLoading(true)
      await setDoc(doc(db, `users/${userData.id}`), updatedData)
      toast.success('Profile Updated')
    } catch (error) {
      console.log(error.message)
      toast.error('There was some error')
    }

    getData()
  }

  return (
    <Modal modalOpen={open} setModalOpen={setOpen} styleEl='formModalBody'>
      {/* <div className='form-wrapper sign-up-wrapper'> */}
      {/* <div className='center'> */}
      <h1>Update Profile</h1>
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
            <label className='details'>Name</label>
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
            <label className='details'>Phone Number</label>
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
      </form>
      {/* <SocialLogin /> */}
      {/* </div> */}
      {/* </div> */}
    </Modal>
  )
}

export default UpdateProfileModal
