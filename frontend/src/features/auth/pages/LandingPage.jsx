
import React from "react";
import FullScreenVideo from "../../../components/layout/FullScreenVideo";
import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import useRoleNavigation from "../hooks/useRoleNavigation";
import RoleGrid from "../../../components/roles/RoleGrid";
import landingVideo from "../../../assets/landing.mp4";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const handleCardClick = useRoleNavigation();
  console.log("LandingPage component loaded");

  return (
    <div className="landing-page">
      <div className="background-wrapper">
        <FullScreenVideo src={landingVideo} />

        <div className="overlay">
          <Header />

          <main className="main">
            <h2 className="main__headline">Choose how to connect</h2>

            <RoleGrid onSelect={handleCardClick} />

            <p className="card__text" style={{ marginTop: "2.5rem", textAlign: "center" }}>
              Don&apos;t have an account? <a href="/signup" className="link">Sign up now</a>
            </p>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
