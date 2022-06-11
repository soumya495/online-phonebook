import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import FileBase from 'react-file-base64'
import { auth, db } from '../firebase'
import { setDoc, doc } from '@firebase/firestore'
import Modal from './Modal'
import Loading from './Loading'

import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

import { storage } from '../firebase'

import { isImage } from '../ValidImage'

function UpdateProfileModal({ userData, open, setOpen, setLoading, getData }) {
  const [formData, setFormData] = useState({
    name: userData.name,
    phoneNumber: userData.phoneNumber,
    facebookLink: userData.facebookLink,
    instagramLink: userData.instagramLink,
    linkedInLink: userData.linkedInLink,
    imageData: userData.imageData,
  })

  // const [uploaded, setUploaded] = useState(false)
  const [url, setUrl] = useState(null)
  const [fileUp, setFileUp] = useState(null)

  const {
    name,
    phoneNumber,
    facebookLink,
    instagramLink,
    linkedInLink,
    imageData,
  } = formData

  const handleUploadChange = () => {
    const file = document.getElementById('fileInpUpd').files[0]
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
    const file = document.getElementById('fileInpUpd').files[0]
    // console.log(file)

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
        // console.log(err)
        toast('Not Uploaded')
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          // console.log(url)
          setUrl(url)
        })
      }
    )
  }

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()

    if (fileUp && !url) {
      toast.warn('Wait for the image to upload')
      return
    }

    // console.log(url)
    // console.log('Sign Up Data: ', formData)

    const updatedData = {
      ...formData,
      id: userData.id,
      email: userData.email,
      imageData: url ?? userData.imageData,
    }

    setOpen(false)

    try {
      setLoading(true)
      await setDoc(doc(db, `users/${userData.id}`), updatedData)
      toast.success('Profile Updated')
    } catch (error) {
      // console.log(error.message)
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
          <div className='filebox'>
            <input type='file' id='fileInpUpd' onChange={handleUploadChange} />

            <button onClick={uploadFile} disabled={url ? true : false}>
              {url ? 'Uploaded' : 'Upload Photo'}
            </button>
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
