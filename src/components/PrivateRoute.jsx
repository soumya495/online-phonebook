import { Navigate, Outlet } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'
import GlobalContext from '../GlobalContext'

function PrivateRoute() {
  const { user } = useContext(GlobalContext)
  const [loggedIn, setLoggedIn] = useState(user)

  useEffect(() => {
    setLoggedIn(user)
  }, [])

  return loggedIn ? <Outlet /> : <Navigate to='/log-in' />
}

export default PrivateRoute
