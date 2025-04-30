// Description: Header component for the ProScout application

import { Logo } from "../../assets";
import "./Header.css";

const Header = () => (
  <header className="header">
    <Logo className="h-10 w-10" />
    <h1 className="header__title">ProScout</h1>
  </header>
);

export default Header;
