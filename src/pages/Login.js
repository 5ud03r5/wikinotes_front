import React from "react";
import { Form, Button, FormGroup, Input, Label } from "reactstrap";
import classes from "./Login.module.css";
import Cookies from 'js-cookies'
import { useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store";
import querystring from 'querystring'
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function fetchLogin(username, password) {
    console.log({ username: username, password: password });
    const body = querystring.stringify({
        grant_type: 'password',
        username: username,
        password: password
    });
    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    });
    console.log(response.body);
    const data = await response.json();
    console.log(data);

    if (response.ok) {
      dispatch(authActions.userReducer(jwt_decode(data.access_token)));
      dispatch(authActions.tokenReducer(data));
      dispatch(authActions.refreshTokenReducer(data.refresh_token));

      console.log(data)
      
      Cookies.setItem("access_token", JSON.stringify(data.access_token));
      Cookies.setItem("refresh_token", JSON.stringify(data.refresh_token));
      console.log('cookie ')
      navigate("/articles");
      
    } else {
      alert("something went wrong");
    }
  }
  const loginForm = (event) => {
    event.preventDefault();
    fetchLogin(event.target.username.value, event.target.password.value);
  };

  return (
    <div className={`container ${classes.div}`}>
      <Form onSubmit={loginForm}>
        <FormGroup className={classes.label}>
          <Label>SIEM WIKI</Label>
        </FormGroup>
        <FormGroup>
          <Input type="text" name="username" placeholder="Username"></Input>
        </FormGroup>
        <FormGroup>
          <Input type="password" name="password" placeholder="Password"></Input>
        </FormGroup>
        <FormGroup>
          <Button type="submit">Login</Button>
        </FormGroup>
      </Form>
    </div>
  );
};

export default Login;
