import React from "react";
import { useNavigate } from "react-router-dom";
import landingVideo from "../assets/landing.mp4";
import { UserIcon, UsersIcon, EyeIcon } from "lucide-react";
import Logo from "../components/loginPages/Logo";
import "./LandingPage.css";           // <-- import the stylesheet

const LandingPage = () => {
  const navigate = useNavigate();
  const handleCardClick = role => navigate(`/login/${role}`);

  return (
    <div className="landing-page">
      <div className="background-wrapper">
        {/* Background video */}
        <video
          src={landingVideo}
          type="video/mp4"
          loop
          muted
          autoPlay
          className="background-video"
        />

        {/* Dark overlay with content */}
        <div className="overlay">
          {/* ----- Header ----- */}
          <header className="header">
            <Logo className="h-10 w-10" />
            <h1 className="header__title">ProScout</h1>
          </header>

          {/* ----- Main ----- */}
          <main className="main">
            <h2 className="main__headline">Choose how to connect</h2>

            <div className="card-grid">
              {/* Player */}
              <div
                className="card"
                onClick={() => handleCardClick("player")}
              >
                <div className="card__icon icon--player">
                  <UserIcon className="text-white h-8 w-8" />
                </div>
                <h3 className="card__title">Connect as Player</h3>
                <p className="card__text">
                  Showcase your skills, connect with teams, and take your career
                  to the next level.
                </p>
              </div>

              {/* Team */}
              <div
                className="card"
                onClick={() => handleCardClick("team")}
              >
                <div className="card__icon icon--team">
                  <UsersIcon className="text-white h-8 w-8" />
                </div>
                <h3 className="card__title">Connect as Team</h3>
                <p className="card__text">
                  Find the perfect talent for your roster and manage your
                  team's recruitment process.
                </p>
              </div>

              {/* Scout */}
              <div
                className="card"
                onClick={() => handleCardClick("scout")}
              >
                <div className="card__icon icon--scout">
                  <EyeIcon className="text-white h-8 w-8" />
                </div>
                <h3 className="card__title">Connect as Scout</h3>
                <p className="card__text">
                  Discover emerging talent, share your insights, and help shape
                  the future of the sport.
                </p>
              </div>
            </div>

            <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
              <p className="card__text">
                Don&#39;t have an account?{" "}
                <a href="/signup" className="link">
                  Sign up now
                </a>
              </p>
            </div>
          </main>

          {/* ----- Footer ----- */}
          <footer className="footer">
            <p className="footer__text">
              &copy; {new Date().getFullYear()} ProScout. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
