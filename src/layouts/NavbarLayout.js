import classes from "./NavbarLayout.module.css";

const NavbarLayout = (props) => {
  return <div className={`${classes.sidebar}`}>{props.children}</div>;
};

export default NavbarLayout;
