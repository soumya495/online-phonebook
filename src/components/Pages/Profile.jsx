import styles from './styles/Profile.module.css'
import Navbar from '../Navbar'
import GlobalContext from '../../GlobalContext'
import { useState, useContext, useEffect } from 'react'
import Modal from '../Modal'
import { toast } from 'react-toastify'
import { sendEmailVerification } from '@firebase/auth'
import { doc, getDoc } from '@firebase/firestore'
import { db } from '../../firebase'
import Loading from '../Loading'
import UpdateProfileModal from '../UpdateProfileModal'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const { user } = useContext(GlobalContext)
  const [modalOpen, setModalOpen] = useState(false)
  const [mailSent, setMailSent] = useState(
    localStorage.getItem('mailsent')
      ? JSON.parse(localStorage.getItem('mailsent'))
      : false
  )
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { emailVerified, providerData } = user
  const { email } = providerData[0]
  const navigate = useNavigate()

  // console.log(user)

  const SendVerificationMail = async () => {
    try {
      await sendEmailVerification(user)
      toast.success('verfication link sent')
      localStorage.setItem('mailsent', JSON.stringify(true))
      setMailSent(true)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (emailVerified) {
      localStorage.removeItem('mailsent')
      getUserData()
    }
  }, [])

  const getUserData = async () => {
    setLoading(true)

    const docRef = doc(db, 'users', user.uid)
    const docSnap = await getDoc(docRef)
    // console.log('Data from db', docSnap.data())
    setUserData(docSnap.data())
    setLoading(false)
  }

  // console.log(userData)

  return (
    <div className='container'>
      <Navbar />
      {!emailVerified && (
        <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
          <p className='mainModalText'>Verify Your Email Address</p>
          <p className='smallModaltext'>
            A verification link {mailSent ? 'has been sent ' : 'will be sent '}
            to
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
              userData && userData.imageData
                ? userData.imageData
                : '../../Assets/default-avatar.png'
            }
            alt='user'
            width={100}
            height={100}
          />
          <h4>{userData ? userData.name : ''}</h4>
        </div>
        <div className={styles.right}>
          <div className={styles.info}>
            <h3>Information</h3>
            <div className={styles.info_data}>
              <div className={styles.data}>
                <h4>Email</h4>
                <p>{userData ? userData.email : ''}</p>
              </div>
              <div className={styles.data}>
                <h4>Phone</h4>
                <p>{userData ? userData.phoneNumber : ''}</p>
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
              <div className='profile-btns'>
                <button onClick={() => navigate('/my-directory')}>
                  My Directory
                </button>
                <button onClick={() => setOpen(true)}>Update Profile</button>
              </div>
            </div>
          </div>
          <div className={styles.social_media}>
            <ul>
              {userData && userData.facebookLink && (
                <li>
                  <a
                    href={new URL(userData.facebookLink)}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <i className='fab fa-facebook-f' />
                  </a>
                </li>
              )}
              {userData && userData.instagramLink && (
                <li>
                  <a
                    href={new URL(userData.instagramLink)}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <i className='fab fa-instagram' />
                  </a>
                </li>
              )}
              {userData && userData.linkedInLink && (
                <li>
                  <a
                    href={new URL(userData.linkedInLink)}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <i className='fab fa-linkedin' />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      {userData && open && (
        <UpdateProfileModal
          userData={userData}
          open={open}
          setOpen={setOpen}
          setLoading={setLoading}
          getData={getUserData}
        />
      )}
    </div>
  )
}

export default Profile
