import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Pages/Home'
import SignUp from './components/Pages/SignUp'
import './Global.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/sign-up' element={<SignUp />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
