import { useState, useEffect, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import authService from './appwrite/auth';
import { login, logout } from './store/authSlice';
import { Footer, Header, GlobalLoader, RouteProgressBar } from './components';
import { Navbar, Sidebar } from './new-components';
import { SidebarProvider, SidebarInset } from '@/new-components/ui/sidebar';
import { Outlet } from 'react-router-dom';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  return (
    <SidebarProvider defaultOpen={true}>
      <RouteProgressBar />
      <Sidebar />
      <SidebarInset className="min-w-0 bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300">
        <Navbar />
        <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col px-4 py-6 sm:px-6 lg:px-8">
          {loading ? (
            <GlobalLoader />
          ) : (
            <Suspense fallback={<GlobalLoader />}>
              <Outlet />
            </Suspense>
          )}
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
