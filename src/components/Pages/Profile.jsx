import styles from './styles/Profile.module.css'
import Navbar from '../Navbar'
import GlobalContext from '../../GlobalContext'
import { useState, useContext, useEffect } from 'react'
import Modal from '../Modal'
import { toast } from 'react-toastify'
import { sendEmailVerification } from '@firebase/auth'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, where } from '@firebase/firestore'
import { db } from '../../firebase'
import Loading from '../Loading'

function Profile() {
  const { user } = useContext(GlobalContext)
  const [modalOpen, setModalOpen] = useState(false)
  const [mailSent, setMailSent] = useState(false)
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)

  const { emailVerified, providerData } = user
  const { displayName, email, photoURL, phoneNumber } = providerData[0]

  console.log(user)

  const SendVerificationMail = async () => {
    try {
      await sendEmailVerification(user)
      toast.success('email send')
      setMailSent(true)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (emailVerified) {
      getUserData()
    }
  }, [])

  const getUserData = async () => {
    const q = query(collection(db, 'users'), where('id', '==', user.uid))
    // const colRef = collection(db, 'users')
    setLoading(true)
    const res = await getDocs(q)
    const dataFromDb = res.docs[0]._document.data.value.mapValue.fields
    setUserData(dataFromDb)
    setLoading(false)
  }

  console.log(userData)

  return (
    <div className='container'>
      <Navbar />
      {!emailVerified && (
        <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
          <p className='mainModalText'>Verify Your Email Address</p>
          <p className='smallModaltext'>
            A verification {mailSent ? 'has been sent ' : 'will be sent '} to
          </p>
          <p className='smallModaltext modaltextgray'>{email}</p>
          {mailSent && <p>Reload Once You Verify!</p>}
          <div className='modal-btn-conatiner'>
            <button onClick={() => SendVerificationMail()}>
              {mailSent ? 'Resend' : 'Verify'}
            </button>
          </div>
        </Modal>
      )}
      {loading && <Loading />}
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <img
            src={
              userData
                ? userData.imageData.stringValue
                : '../../Assets/default-avatar.png'
            }
            alt='user'
            width={100}
          />
          <h4>{userData ? userData.name.stringValue : ''}</h4>
        </div>
        <div className={styles.right}>
          <div className={styles.info}>
            <h3>Information</h3>
            <div className={styles.info_data}>
              <div className={styles.data}>
                <h4>Email</h4>
                <p>{userData ? userData.email.stringValue : ''}</p>
              </div>
              <div className={styles.data}>
                <h4>Phone</h4>
                <p>{userData ? userData.phoneNumber.stringValue : ''}</p>
              </div>
            </div>
          </div>
          <div className={styles.projects}>
            <h3 />
            <div className={styles.projects_data}>
              <div className={styles.data}>
                <h4>My Phonebook</h4>
                <p />
              </div>
              <div className={styles.data}>
                <button className={styles.btn}>Logout</button>
                <p />
              </div>
            </div>
          </div>
          <div className={styles.social_media}>
            <ul>
              <li>
                <a href='#'>
                  <i className='fab fa-facebook-f' />
                </a>
              </li>
              <li>
                <a href='#'>
                  <i className='fab fa-twitter' />
                </a>
              </li>
              <li>
                <a href='#'>
                  <i className='fab fa-instagram' />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
