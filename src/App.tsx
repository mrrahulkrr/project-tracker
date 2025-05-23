"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ChakraProvider } from "@chakra-ui/react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./services/firebase"
import { setUser } from "./store/slices/authSlice"
import type { RootState } from "./store/store"
import type { AppDispatch } from "./store/store"
import theme from "./theme"

import AuthWrapper from "./components/Auth/AuthWrapper"
import Dashboard from "./components/Layout/Dashboard"

function App() {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
          }),
        )
      } else {
        dispatch(setUser(null))
      }
    })

    return () => unsubscribe()
  }, [dispatch])

  return (
    <ChakraProvider theme={theme}>
      {user ? <Dashboard /> : <AuthWrapper />}
    </ChakraProvider>
  )
}

export default App
