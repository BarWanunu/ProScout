// Footer component for the application
import "./Footer.css"; 

const Footer = () => (
    <footer className="footer">
      <p className="footer__text">
        &copy; {new Date().getFullYear()} ProScout. All rights reserved.
      </p>
    </footer>
  );
  export default Footer;
  