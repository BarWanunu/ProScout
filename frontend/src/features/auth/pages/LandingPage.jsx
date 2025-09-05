// Description: Landing page component for the application.
// It includes a full-screen video background, a header, a role selection grid, and a footer.

import { FullScreenVideo } from "../../../components/layout";
import useRoleNavigation from "../hooks/useRoleNavigation";
import RoleGrid from "../../../components/roles/RoleGrid";
import landingVideo from "../../../assets/landing.mp4";
import "../../../styles/LandingPage.css";

const LandingPage = () => {
  const handleCardClick = useRoleNavigation();
 
  return (
    <div className="landing-page">
      <div className="background-wrapper">
        <FullScreenVideo src={landingVideo} />
        <div className="overlay">
          <main className="main">
            <h2 className="main__headline">Choose how to connect</h2>
            <RoleGrid onSelect={handleCardClick} />
            <p className="card__text" style={{ marginTop: "2.5rem", textAlign: "center" }}>
              Don&apos;t have an account? <a href="/signup" className="link">Sign up now</a>
            </p>
          </main>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
