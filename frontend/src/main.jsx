import { StrictMode, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './store/store.js';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from './components/index.js';
import { ThemeProvider } from '@/new-components/ui/theme-provider';
import './appwriteTest.js';

const HomeV2 = lazy(() => import('./new-pages/HomeV2.jsx'));
const AddPost = lazy(() => import('./new-pages/AddPostV2.jsx'));
const LoginV2 = lazy(() => import('./new-pages/LoginV2.jsx'));
const SignupV2 = lazy(() => import('./new-pages/SignupV2.jsx'));
const EditPost = lazy(() => import('./new-pages/EditPostV2.jsx'));
const Post = lazy(() => import('./new-pages/PostV2.jsx'));
const AllPostsV2 = lazy(() => import('./new-pages/AllPostsV2.jsx'));
const ProfileV2 = lazy(() => import('./new-pages/ProfileV2.jsx'));
const SettingsV2 = lazy(() => import('./new-pages/SettingsV2.jsx'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomeV2 />,
      },
      {
        path: '/login',
        element: (
          <AuthLayout authentication={false}>
            <LoginV2 />
          </AuthLayout>
        ),
      },
      {
        path: '/signup',
        element: (
          <AuthLayout authentication={false}>
            <SignupV2 />
          </AuthLayout>
        ),
      },
      {
        path: '/all-posts',
        element: (
          <AuthLayout authentication={true}>
            <AllPostsV2 />
          </AuthLayout>
        ),
      },
      {
        path: '/add-post',
        element: (
          <AuthLayout authentication={true}>
            <AddPost />
          </AuthLayout>
        ),
      },
      {
        path: '/edit-post/:slug',
        element: (
          <AuthLayout authentication={true}>
            <EditPost />
          </AuthLayout>
        ),
      },
      {
        path: '/profile',
        element: (
          <AuthLayout authentication={true}>
            <ProfileV2 />
          </AuthLayout>
        ),
      },
      {
        path: '/settings',
        element: (
          <AuthLayout authentication={true}>
            <SettingsV2 />
          </AuthLayout>
        ),
      },
      {
        path: '/post/:slug',
        element: <Post />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);

console.log('Appwrite URL:', import.meta.env.VITE_APPWRITE_URL);
