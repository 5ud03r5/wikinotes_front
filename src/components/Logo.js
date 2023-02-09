import { NavbarBrand } from "reactstrap";
import classes from "./Logo.module.css";

const Logo = () => {
  return (
    <NavbarBrand className={classes.navlogo} href="/">
      <span className={classes.wikinotes}>WIKI NOTES</span>
    </NavbarBrand>
  );
};

export default Logo;
