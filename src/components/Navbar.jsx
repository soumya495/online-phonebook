import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'

function Navbar() {
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

  return (
    <div className='navbar'>
      <NavLink to='/'>
        <img src='../Assets/phone-book.png' className='logo' />
      </NavLink>
      <nav>
        <ul className='menuList'>
          <li>
            <NavLink to='/sign-up'>Sign Up</NavLink>
          </li>
          <li>
            <NavLink to='/'>About Us</NavLink>
          </li>
          <li>
            <a>Media</a>
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
