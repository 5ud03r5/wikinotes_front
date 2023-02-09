import { Route, Redirect } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const PrivateAdminRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  return (isLoggedIn && user.superuser) ? children : <Navigate to="/articles" />;
};

export default PrivateAdminRoute;
