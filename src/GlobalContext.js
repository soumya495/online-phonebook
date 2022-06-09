import { onAuthStateChanged } from '@firebase/auth'
import { useState, useEffect, createContext } from 'react'
import { auth } from './firebase'

const GlobalContext = createContext()

export const GlobalContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setUser(user)
      else setUser(null)
      setLoading(false)
    })
  }, [])

  return (
    <GlobalContext.Provider value={{ user }}>
      {!loading && children}
    </GlobalContext.Provider>
  )
}

export default GlobalContext
