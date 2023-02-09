import { useNavigate } from "react-router-dom";
import { Button, NavItem, NavLink } from "reactstrap";
import { useDispatch } from "react-redux";
import { authActions } from "../store";
import { produceWithPatches } from "immer";
import { useEffect } from "react";

const Logout = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  dispatch(authActions.logoutReducer());
  navigate("/login");
};

export default Logout;
