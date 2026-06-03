import { useState, useEffect, Suspense } from 'react'
import {useDispatch} from 'react-redux'
import './App.css'
import authService from './appwrite/auth'
import {login, logout} from './store/authSlice'
import { Footer, Header, GlobalLoader, RouteProgressBar } from './components'
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
  
  return (
    <div className='min-h-screen flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300'>
      <RouteProgressBar />
      <Header />
      <main className='flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col'>
        {loading ? (
          <GlobalLoader />
        ) : (
          <Suspense fallback={<GlobalLoader />}>
            <Outlet />
          </Suspense>
        )}
      </main>
      <Footer />
    </div>
  )
}


export default App
