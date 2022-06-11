import Modal from '../Modal'
import { useState } from 'react'
import FileBase from 'react-file-base64'
import { auth, db } from '../../firebase'
import { doc, setDoc, updateDoc, arrayUnion, getDoc } from '@firebase/firestore'
import { useContext } from 'react'
import GlobalContext from '../../GlobalContext'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'

import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../../firebase'
import { isImage } from '../../ValidImage'

function AddContact({ setOpen, setLoading, getData }) {
  const { user } = useContext(GlobalContext)
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    facebookLink: '',
    instagramLink: '',
    linkedInLink: '',
    imageData: '',
  })
  const [url, setUrl] = useState(null)
  const [fileUp, setFileUp] = useState(null)

  const handleUploadChange = () => {
    const file = document.getElementById('fileInpCont').files[0]

    if (!isImage(file)) {
      toast.error('Please upload image files')
      return
    }

    if (file) {
      setFileUp(file.name)
    }
  }

  const {
    name,
    phoneNumber,
    facebookLink,
    instagramLink,
    linkedInLink,
    imageData,
  } = formData

  const uploadFile = async (e) => {
    e.preventDefault()
    const file = document.getElementById('fileInpCont').files[0]
    // console.log(file)

    if (!file) return
    const storageRef = ref(storage, `contacts/${user.uid}/${file.name}`)
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

    setOpen(false)
    try {
      setLoading(true)
      const docRef = doc(db, `contacts`, `${user.uid}`)
      const docSnap = await getDoc(docRef)
      if (!docSnap.data()) {
        await setDoc(doc(db, 'contacts', user.uid), {
          users: arrayUnion({
            ...formData,
            id: uuidv4(),
            imageData: url,
          }),
        })
      } else {
        await updateDoc(doc(db, 'contacts', user.uid), {
          users: arrayUnion({
            ...formData,
            id: uuidv4(),
            imageData: url,
          }),
        })
      }

      setLoading(false)
      getData()
      toast.success('Added to contact')
    } catch (error) {
      setLoading(false)
      // console.log(error.message)
      toast.error('Failed to add contact')
    }

    // console.log('Contact Data', formData)
  }

  return (
    <Modal setModalOpen={setOpen} styleEl='formModalBody'>
      <h1>Add Contact</h1>
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
            {/* <FileBase
              type='file'
              multiple={false}
              onDone={({ base64 }) =>
                setFormData({ ...formData, imageData: base64 })
              }
            />
            <label className='details'>Upload Photo</label> */}
            <input type='file' id='fileInpCont' onChange={handleUploadChange} />

            <button onClick={uploadFile} disabled={url ? true : false}>
              {url ? 'Uploaded' : 'Upload Photo'}
            </button>
          </div>
        </div>
        <div className='full-width'>
          <input type='submit' defaultValue='Sign-Up' />
        </div>
      </form>
    </Modal>
  )
}

export default AddContact
