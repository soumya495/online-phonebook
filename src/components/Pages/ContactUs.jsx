import Navbar from '../Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  solid,
  regular,
  brands,
} from '@fortawesome/fontawesome-svg-core/import.macro'
import { useState, useEffect } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../../firebase'
import { toast } from 'react-toastify'
import emailjs from 'emailjs-com'

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const { name, email, message } = formData

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()

    await emailjs
      .sendForm(
        process.env.REACT_APP_SERVICEID,
        process.env.REACT_APP_TEMPLATEID,
        e.target,
        process.env.REACT_APP_PUBLIC_KEY
      )
      .then(
        (result) => {
          console.log(result.text)
        },
        (error) => {
          console.log(error.text)
        }
      )

    try {
      const colref = collection(db, 'contact-form')
      await addDoc(colref, formData)
      toast.success('Thank You For Contacting Us')
    } catch (error) {
      console.log(error.message)
      toast.error('Could not send form Data')
    }
    setFormData({
      name: '',
      email: '',
      message: '',
    })
  }

  return (
    <>
      <div className='container'>
        <Navbar />
        <div className='contact-section'>
          <div className='contact-info'>
            <img src='../../Assets/calling.png' alt='calling' />
            <div>
              <FontAwesomeIcon icon={solid('map-marker-alt')} />
              India,West Bengal
            </div>
            <div>
              <FontAwesomeIcon icon={solid('envelope')} />
              skywalker10020@gmail.com
            </div>
            <div>
              <FontAwesomeIcon icon={solid('clock')} />
              Mon - Fri 8:00 AM to 5:00 PM
            </div>
          </div>
          <div className='contact-form'>
            <h2>Contact Us</h2>
            <form className='contact' onSubmit={handleOnSubmit}>
              <input
                type='text'
                name='name'
                className='text-box'
                placeholder='Your Name'
                value={name}
                onChange={handleOnChange}
                required
              />
              <input
                type='email'
                name='email'
                className='text-box'
                placeholder='Your Email'
                value={email}
                onChange={handleOnChange}
                required
              />
              <textarea
                name='message'
                rows={5}
                placeholder='Your Message'
                required
                value={message}
                onChange={handleOnChange}
              />

              <input
                type='submit'
                name='submit'
                className='send-btn'
                defaultValue='Send'
              />
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactUs
