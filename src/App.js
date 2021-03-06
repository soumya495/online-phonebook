import { GlobalContextProvider } from './GlobalContext'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// components
import Home from './components/Pages/Home'
import LogIn from './components/Pages/LogIn'
import SignUp from './components/Pages/SignUp'
import PrivateRoute from './components/PrivateRoute'
import ContactUs from './components/Pages/ContactUs'
import MyDirectory from './components/Pages/MyDirectory'

// toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import './Global.css'
import Profile from './components/Pages/Profile'
import OurTeam from './components/Pages/OurTeam'

function App() {
  return (
    <GlobalContextProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/our-team' element={<OurTeam />} />
          <Route path='/log-in' element={<LogIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route path='/my-directory' element={<PrivateRoute />}>
            <Route path='/my-directory' element={<MyDirectory />} />
          </Route>
          <Route path='/contact-us' element={<ContactUs />} />
        </Routes>
      </Router>
      <ToastContainer
        position='top-center'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </GlobalContextProvider>
  )
}

export default App
