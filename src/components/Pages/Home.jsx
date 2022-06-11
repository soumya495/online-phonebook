import Navbar from '../Navbar'
import GlobalContext from '../../GlobalContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const { user } = useContext(GlobalContext)
  const navigate = useNavigate()

  return (
    <div className='container'>
      <Navbar />
      <div className='row'>
        <div className='col1'>
          <h2>
            PhoneBook
            <br /> Manager
          </h2>
          <h3>Keep your contacts safe</h3>
          <p>(Compatible/Generic)</p>
          <button
            type='button'
            onClick={() => {
              if (user) {
                navigate('/my-directory')
              } else {
                navigate('/log-in')
              }
            }}
          >
            Explore
            <img src='../../Assets/arrow.png' />
          </button>
        </div>
        <div className='col2'>
          <img src='../../Assets/casual.png' className='controller' />
          <div className='colorbox' />
        </div>
      </div>
      <div className='sociallinks'>
        <a href='#'>
          <img src='../../Assets/fb.png' />
        </a>
        <a href='#'>
          <img src='../../Assets/ig.png' />
        </a>
        <a href='#'>
          <img src='../../Assets/tw.png' />
        </a>
      </div>
    </div>
  )
}

export default Home
