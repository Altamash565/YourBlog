import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status : false,
    userData: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            // Support both wrapped {userData} and direct user object payloads
            state.userData = action.payload?.userData || action.payload;
        },

        logout: (state) => {
            state.status = false;
            state.userData = null;
        }
    }
})

export const {login, logout} = authSlice.actions;

export default authSlice.reducer;