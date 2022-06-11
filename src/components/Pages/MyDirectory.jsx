import React from 'react'
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import GlobalContext from '../../GlobalContext'
import { db } from '../../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import styles from './styles/Directory.module.css'
import { NavLink } from 'react-router-dom'
import AddContact from '../Directory/AddContact'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPlus } from 'react-icons/fa'
import Loading from '../Loading'
import { FaTrashAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Modal from '../Modal'

function MyDirectory() {
  const [contactList, setContactList] = useState(null)
  const [displayUsers, setDisplayUsers] = useState(null)
  const { user } = useContext(GlobalContext)
  const [open, setOpen] = useState(false)
  const [open1, setOpen1] = useState(false)
  const [userModalData, setUserModalData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sortedList, setSortedList] = useState(null)

  console.log(user)

  const getData = async () => {
    const docRef = doc(db, `contacts`, `${user.uid}`)
    setLoading(true)
    const docSnap = await getDoc(docRef)
    if (!docSnap.data()) {
      setContactList(null)
      setDisplayUsers(null)
      setLoading(false)
    } else {
      console.log('Hello: ', docSnap.data())
      setContactList(docSnap.data().users)
      setDisplayUsers(docSnap.data().users)
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    if (sortedList) {
      setDisplayUsers(sortedList)
      setSortedList(null)
    }
  }, [sortedList])

  // LINEAR SEARCH
  const search = (e) => {
    const searchQuery = e.target.value
    let filteredUsers = []

    for (let i = 0; i < contactList.length; i++) {
      if (contactList[i].name.toLowerCase().includes(searchQuery.toLowerCase()))
        filteredUsers.push(contactList[i])
    }
    setDisplayUsers(filteredUsers)
  }

  // MERGE SORT
  const sortList = (e) => {
    e.preventDefault()
    const testArr = displayUsers
    mergeSort(testArr, 0, testArr.length - 1)
    setSortedList(testArr)
  }

  const mergeSort = (arr, s, e) => {
    if (s < e) {
      const mid = parseInt((s + e) / 2)
      mergeSort(arr, s, mid)
      mergeSort(arr, mid + 1, e)
      merge(arr, s, mid, e)
    }
  }

  const merge = (arr, s, m, e) => {
    const newArr = []
    let i = s,
      j = m + 1,
      k = 0

    while (i <= m && j <= e) {
      if (arr[i].name.localeCompare(arr[j].name) < 0) {
        newArr.push(arr[i])
        i++
      } else {
        newArr.push(arr[j])
        j++
      }
    }
    while (i <= m) {
      newArr.push(arr[i])
      i++
    }
    while (j <= e) {
      newArr.push(arr[j])
      j++
    }
    for (let p = s; p <= e; p++) {
      arr[p] = newArr[k]
      k++
    }
  }

  const handleContactDetail = async (id) => {
    setOpen1(false)
    try {
      setLoading(true)
      await updateDoc(doc(db, 'contacts', user.uid), {
        users: contactList.filter((user) => user.id !== id),
      })
      getData()
      toast.success('Deleted Contact')
      setLoading(false)
    } catch (err) {
      toast.error('Failed to delete contact')
      console.log(err.message)
      setLoading(false)
    }
  }

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
            <input
              type='text'
              onChange={search}
              placeholder='Search Contacts'
            />
          </form>
          <button className={styles.sortBtn} onClick={sortList}>
            Sort List
          </button>
        </dt>
        {!displayUsers || !displayUsers.length ? (
          <div className={styles.noContact}>
            <img src='../../Assets/business-3d.png' alt='calling' />
            <h3>No Contacts Found</h3>
          </div>
        ) : (
          <div className={styles.contactlist} id='contact-list'>
            {displayUsers.map((user) => (
              <div
                className={styles.contact}
                key={user.id}
                onClick={() => {
                  setUserModalData(user)
                  setOpen1(true)
                }}
              >
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
      {open1 && (
        <Modal setModalOpen={setOpen1}>
          <div className={styles.modalUserData}>
            <img
              src={userModalData.imageData ?? '../../Assets/person-icon.png'}
              alt='profile'
            />

            <p>{userModalData.name}</p>
            <p>{userModalData.phoneNumber}</p>
            <div className={styles.linkkks}>
              {userModalData.facebookLink && (
                <a
                  href={userModalData.facebookLink}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <FaFacebookF fontSize='1.5rem' fill='#222' />
                </a>
              )}
              {userModalData.instagramLink && (
                <a
                  href={userModalData.instagramLink}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <FaInstagram fontSize='1.5rem' fill='#222' />
                </a>
              )}
              {userModalData.linkedInLink && (
                <a
                  href={userModalData.linkedInLink}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <FaLinkedinIn fontSize='1.5rem' fill='#222' />
                </a>
              )}
            </div>
            <button
              className={styles.sortBtn}
              onClick={() => handleContactDetail(userModalData.id)}
            >
              Delete User
              <FaTrashAlt fill='#ce0172' fontSize='0.75rem' />
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default MyDirectory
