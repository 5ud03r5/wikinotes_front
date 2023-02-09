import { NavbarBrand } from "reactstrap";
import classes from "./Logo.module.css";

const Logo = () => {
  return (
    <NavbarBrand className={classes.navlogo} href="/">
      <span className={classes.wikinotes}>WIKI NOTES</span>
      {/* <img alt="logo" src="/atos1.png" style={{ heigth: 25, width: 80 }} /> */}
    </NavbarBrand>
  );
};

export default Logo;
