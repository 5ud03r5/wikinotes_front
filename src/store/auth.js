import { createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookies'
const dataToken =
  Cookies.getItem("access_token") &&
  JSON.parse(Cookies.getItem("access_token"));
const refreshToken = Cookies.getItem("refresh_token") &&
JSON.parse(Cookies.getItem("refresh_token"));
const initialAuthState = {
  user: null,
  superuser: false,
  authToken: dataToken,
  refreshToken: refreshToken,
  isLoggedIn: !!Cookies.getItem("access_token"),
};
const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    userReducer(state, action) {
      
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    tokenReducer(state, action) {
      
      state.authToken = action.payload;
    },
    refreshTokenReducer(state, action) {
      state.refreshToken = action.payload;
    }
  },
});

export default authSlice;
