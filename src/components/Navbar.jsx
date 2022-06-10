import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import GlobalContext from '../GlobalContext'
import Modal from './Modal'
import { signOut } from '@firebase/auth'
import { toast } from 'react-toastify'
import { auth } from '../firebase'

function Navbar() {
  const { user } = useContext(GlobalContext)
  const navigate = useNavigate()

  const [modalOpen, setModalOpen] = useState(false)

  console.log(user)

  useEffect(() => {
    const menuList = document.querySelector('.menuList')
    // if(document.body.w)
    menuList.style.maxHeight = '0px'
    menuList.style.paddingBlock = '0'
  }, [])

  function togglemenu() {
    const menuList = document.querySelector('.menuList')
    if (menuList.style.maxHeight === '0px') {
      menuList.style.maxHeight = '130px'
      menuList.style.paddingBlock = '2rem'
    } else {
      menuList.style.maxHeight = '0px'
      menuList.style.paddingBlock = '0'
    }
  }

  const handleLogOut = () => {
    signOut(auth)
    toast.success('Logout Successful')
    setModalOpen(false)
    navigate('/log-in')
  }

  return (
    <div className='navbar'>
      <NavLink to='/'>
        <img src='../Assets/phone-book.png' className='logo' />
      </NavLink>
      <nav>
        <ul className='menuList'>
          <li>
            {!user ? (
              <NavLink to='/sign-up'>Sign Up</NavLink>
            ) : (
              <>
                <NavLink to='#' onClick={() => setModalOpen(true)}>
                  Log Out
                </NavLink>
                {modalOpen && (
                  <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
                    <p>Are You Sure You Want to Log Out ?</p>
                    <div className='modal-btn-conatiner'>
                      <button onClick={() => setModalOpen(false)}>No</button>
                      <button onClick={handleLogOut}>Log Out</button>
                    </div>
                  </Modal>
                )}
              </>
            )}
          </li>
          <li>
            <NavLink to='/profile'>Profile</NavLink>
          </li>
          <li>
            <NavLink to='/contact-us'>Contact Us</NavLink>
          </li>
          <li>
            <a>About Directory</a>
          </li>
        </ul>
      </nav>
      <img src='../Assets/menu.png' className='menuicon' onClick={togglemenu} />
    </div>
  )
}

export default Navbar
