import classes from "./TopNav.module.css";
import { Nav, Button } from "reactstrap";
import Search from "../components/Search";
import Logout from "../pages/Logout";
import { useSelector } from "react-redux";
const HelperLayout = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className={`d-flex ${classes.layout}`}>
      <Search></Search>
     
      {/* <div className={classes.logged}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-person-check-fill"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"
          />
          <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        </svg>
        <span> {user.username}</span>
      </div> */}
    </div>
  );
};

export default HelperLayout;
