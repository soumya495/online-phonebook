import React from 'react'
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import GlobalContext from '../../GlobalContext'
import { db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'
import styles from './styles/Directory.module.css'
import { NavLink } from 'react-router-dom'
import AddContact from '../Directory/AddContact'
import { FaPlus } from 'react-icons/fa'
import Loading from '../Loading'

function MyDirectory() {
  const [contactList, setContactList] = useState(null)
  const { user } = useContext(GlobalContext)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  console.log(user)

  const getData = async () => {
    const docRef = doc(db, `contacts`, `${user.uid}`)
    setLoading(true)
    const docSnap = await getDoc(docRef)
    if (!docSnap.data()) {
      setContactList(null)
      setLoading(false)
    } else {
      console.log('Hello: ', docSnap.data())
      setContactList(docSnap.data())
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  console.log(contactList)

  return (
    <div className='container directory-container'>
      {loading && <Loading />}
      <NavLink to='/profile' className={styles.backLink}>
        <img src='../../Assets/person-icon.png' alt='person' /> Back To Profile
      </NavLink>
      <section className={styles.container}>
        <dt>
          <form action='#'>
            <i className='fas fa-search' />
            <input type='text' id='search-item' placeholder='Search Contacts' />
          </form>
        </dt>
        {!contactList ? (
          <div className={styles.noContact}>
            <img src='../../Assets/business-3d.png' alt='calling' />
            <h3>No Contacts Found</h3>
            <p>Add Your Contacts to see them</p>
          </div>
        ) : (
          <div className={styles.contactlist} id='contact-list'>
            {contactList.users.map((user) => (
              <div className={styles.contact}>
                <img
                  src={user.imageData ?? '../../Assets/person-icon.png'}
                  alt='profile'
                />
                <div className={styles.pdetails}>
                  <h4>{user.name}</h4>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.addBtn} onClick={() => setOpen(true)}>
          {/* <img src='../../Assets/add.png' alt='add' /> */}
          <FaPlus fill='#fff' />
        </div>
      </section>
      {open && (
        <AddContact
          setOpen={setOpen}
          setLoading={setLoading}
          getData={getData}
        />
      )}
    </div>
  )
}

export default MyDirectory
