import { useState, useEffect } from 'react'
import {useDispatch} from 'react-redux'
import './App.css'
import authService from './appwrite/auth'
import {login, logout} from './store/authSlice'
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'

function App() {

  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()


  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if(userData) {
        dispatch(login({userData}))
      }else{
        dispatch(logout())
      }

    })
    .finally(() => setLoading(false))
  }, [dispatch])
  
  return !loading ? (
    <div className='min-h-screen flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300'>
      <Header />
      <main className='flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <Outlet />
      </main>
      <Footer />
    </div>
  ) : null
}

export default App
