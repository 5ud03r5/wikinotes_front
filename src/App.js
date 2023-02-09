import { Route, Routes, Switch, Redirect } from "react-router-dom";
import React from "react";
import SideBar from "./components/SideBar";
import Articles from "./pages/Articles";
import MyArticles from "./pages/MyArticles";
import Tags from "./pages/Tags";
import Login from "./pages/Login";
import TopNav from "./layouts/TopNav";
import PrivateRoute from "./utils/PrivateRoute";
import { useSelector } from "react-redux";
import Article from "./components/Article";
import { authActions } from "./store";
import { useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Favorite from "./pages/Favorite";
import NotApprovedArticles from "./pages/NotApprovedArticles";
import Compared from "./pages/Compared";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";
import classes from "./App.module.css";
import Users from "./pages/Users";
import PrivateAdminRoute from "./utils/PrivateAdminRoute";
import { useState } from "react";
import Expired from "./pages/Expired";
import Cookies from "js-cookies";
import MyNotes from "./pages/MyNotes";
import Notes from "./pages/Notes";
import { QueryClientProvider, QueryClient } from "react-query";
const queryClient = new QueryClient();
function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const authToken = useSelector((state) => state.auth.authToken);
  const refreshToken = useSelector((state) => state.auth.refreshToken);
  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchRefresh = useCallback(async () => {
    const response = await fetch("http://127.0.0.1:8000/api/token/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(refreshToken),
    });

    const data = await response.json();
    if (response.status === 200) {
      dispatch(authActions.tokenReducer(data));
      //dispatch(authActions.refreshTokenReducer(data));
      dispatch(authActions.userReducer(jwt_decode(data.access_token)));
      Cookies.setItem("access_token", JSON.stringify(data.access_token));
    } else if (response.statusText === "Unauthorized") {
      Cookies.removeItem("access_token");
      Cookies.removeItem("refresh_token");
      dispatch(authActions.tokenReducer(null));
      dispatch(authActions.refreshTokenReducer(null));

      window.location.reload();
      navigate("/login");
    }
  }, [authToken, dispatch]);
  useEffect(() => {
    if (user === null && refreshToken) {
      fetchRefresh();
    }
  }, []);
  /* useEffect(() => {
    let interval = setInterval(() => {
      if (authToken) {
        fetchRefresh();
      }
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [authToken, fetchRefresh]); */

  return (
    <>
      {user !== null && (
        <>
          <TopNav></TopNav>
          <SideBar></SideBar>

          <main>
            <QueryClientProvider client={queryClient} contextSharing={true}>
              <Routes>
                <Route
                  path="/tags"
                  element={
                    <PrivateRoute>
                      <Tags />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Articles />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/articles"
                  element={
                    <PrivateRoute>
                      <Articles />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/articles/:articleId"
                  element={
                    <PrivateRoute>
                      <Article></Article>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/notes"
                  element={
                    <PrivateRoute>
                      <Notes />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/not_approved"
                  element={
                    <PrivateAdminRoute>
                      <NotApprovedArticles />
                    </PrivateAdminRoute>
                  }
                />
                <Route
                  path="/not_approved/compare"
                  element={
                    <PrivateAdminRoute>
                      <Compared />
                    </PrivateAdminRoute>
                  }
                />
                <Route
                  path="/my_notes"
                  element={
                    <PrivateRoute>
                      <MyNotes />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/favorite"
                  element={
                    <PrivateRoute>
                      <Favorite />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/my_articles"
                  element={
                    <PrivateRoute>
                      <MyArticles />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/create_article"
                  element={
                    <PrivateRoute>
                      <CreateArticle />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/edit_article/:articleId"
                  element={
                    <PrivateRoute>
                      <EditArticle />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <PrivateAdminRoute>
                      <Users />
                    </PrivateAdminRoute>
                  }
                />
                <Route
                  path="/expired"
                  element={
                    <PrivateAdminRoute>
                      <Expired />
                    </PrivateAdminRoute>
                  }
                />
              </Routes>
            </QueryClientProvider>
          </main>
        </>
      )}
      {user === null && (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      )}
      <footer className={classes.footer}></footer>
    </>
  );
}

export default App;
