import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isLoggedIn: false, // ✅ added for convenience
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token || state.token;
      state.isLoggedIn = true; 
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false; 
      localStorage.removeItem("token");
    },
    setUser: (state, action) => {
      // ✅ updates user details without affecting token
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { loginSuccess, logout, setUser } = authSlice.actions;

// ✅ Default export is required for `import authReducer from "./authSlice"`
export default authSlice.reducer;
