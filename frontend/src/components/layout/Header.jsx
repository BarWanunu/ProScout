import Logo from "../../assets/Logo";
import "../../features/auth/styles/LandingPage.css"

const Header = () => (
  <header className="header">
    <Logo className="h-10 w-10" />
    <h1 className="header__title">ProScout</h1>
  </header>
);

export default Header;
