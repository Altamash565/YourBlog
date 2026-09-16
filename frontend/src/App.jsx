import { useEffect, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import authService from './appwrite/auth';
import { login, logout, setAuthResolved } from './store/authSlice';
import { GlobalLoader } from './components';
import { Navbar, Sidebar } from './new-components';
import { SidebarProvider, SidebarInset } from '@/new-components/ui/sidebar';
import { Outlet } from 'react-router-dom';
import { saveAuthor } from '@/lib/author';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          if (userData.$id && userData.name) {
            saveAuthor(userData.$id, userData.name);
          }
          dispatch(login({ userData }));
        } else {
          const hasLocalSession = !!localStorage.getItem('yourblog_user_data');
          if (!hasLocalSession) {
            dispatch(logout());
          }
        }
      })
      .catch((err) => {
        console.warn('App.jsx :: auth session check:', err);
        // Only force logout if Appwrite explicitly responds with 401 unauthorized
        if (err?.code === 401 || err?.type === 'user_unauthorized') {
          dispatch(logout());
        }
      })
      .finally(() => {
        dispatch(setAuthResolved());
      });
  }, [dispatch]);

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar />
      <SidebarInset className="min-w-0 bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <Navbar />
        <main className="flex w-full flex-grow flex-col px-4 py-6 sm:px-6 lg:px-8">
          <Suspense fallback={<GlobalLoader />}>
            <Outlet />
          </Suspense>
        </main>
        {/* <Footer /> */}
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
