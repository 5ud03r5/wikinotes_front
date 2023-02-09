
import configureStore from 'redux-mock-store'
import authSlice from "../store/auth";
import Cookies from 'js-cookies'
const dataToken =
  Cookies.getItem("access_token") &&
  JSON.parse(Cookies.getItem("access_token"));
const refreshToken =
  Cookies.getItem("refresh_token") &&
  JSON.parse(Cookies.getItem("refresh_token"));
const initialAuthState = {
  user: null,
  superuser: false,
  authToken: dataToken,
  refreshToken: refreshToken,
  isLoggedIn: !!Cookies.getItem("access_token"),
};



export const mockStore = configureStore([authSlice.reducer]);
export const store = mockStore(initialAuthState);
