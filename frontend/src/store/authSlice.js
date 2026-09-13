import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  try {
    const saved = localStorage.getItem('yourblog_user_data');
    if (saved) {
      const user = JSON.parse(saved);
      return {
        status: true,
        userData: user,
        authResolved: true,
      };
    }
  } catch (e) {
    console.error('Failed to parse saved user from localStorage', e);
  }
  return {
    status: false,
    userData: null,
    authResolved: false,
  };
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      // Support both wrapped {userData} and direct user object payloads
      state.userData = action.payload?.userData || action.payload;
      state.authResolved = true;
      try {
        if (state.userData) {
          localStorage.setItem('yourblog_user_data', JSON.stringify(state.userData));
          localStorage.setItem('yourblog_auth_status', 'true');
        }
      } catch (e) {
        console.error('Failed to save session to localStorage', e);
      }
    },

    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.authResolved = true;
      try {
        localStorage.removeItem('yourblog_user_data');
        localStorage.removeItem('yourblog_auth_status');
        localStorage.removeItem('appwrite_session_id');
      } catch (e) {
        console.error('Failed to remove session from localStorage', e);
      }
    },

    setAuthResolved: (state) => {
      state.authResolved = true;
    },
  },
});

export const { login, logout, setAuthResolved } = authSlice.actions;

export default authSlice.reducer;

