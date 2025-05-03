import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon, ArrowLeftIcon } from "lucide-react";
import Logo from "../../../../assets/Logo";
import "../../styles/LoginStyles/PlayerLogin.css";

const PlayerLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Player login with:", email, password);
    navigate("/player-dashboard");
  };

  return (
    <div className="login-page">
      <div className="bg-wrapper">
        {/* background video */}
        <video
          src="/landing.mp4"
          type="video/mp4"
          loop
          muted
          autoPlay
          playsInline
          className="bg-video"
        />

        {/* overlay */}
        <div className="overlay">
          {/* ----- header ----- */}
          <header className="header">
            <button onClick={() => navigate("/")} className="header__back">
              <ArrowLeftIcon className="h-5 w-5" />
              <span style={{ marginLeft: "0.5rem" }}>Back</span>
            </button>

            <div style={{ display: "flex", alignItems: "center" }}>
              <Logo className="h-10 w-10" />
              <h1 className="header__title">ProScout</h1>
            </div>

            {/* spacer for symmetry */}
            <div style={{ width: "6rem" }} />
          </header>

          {/* ----- main ----- */}
          <main className="main">
            <div className="form-wrap">
              <div className="form-icon">
                <UserIcon className="text-white h-8 w-8" />
              </div>
              <h2 className="form-title">Player Login</h2>

              <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
                <div>
                  <label htmlFor="email" className="label">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="label">Password</label>
                  <input
                    id="password"
                    type="password"
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <label style={{ display: "flex", alignItems: "center" }}>
                    <input id="remember" type="checkbox" className="checkbox" />
                    <span style={{ marginLeft: ".5rem", color: "#d1d5db", fontSize: ".875rem" }}>
                      Remember me
                    </span>
                  </label>

                  <a href="/forgot-password" className="link" style={{ fontSize: ".875rem" }}>
                    Forgot password?
                  </a>
                </div>

                <button type="submit" className="btn">Sign In</button>
              </form>

              <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                <p style={{ color: "#d1d5db", fontSize: ".875rem" }}>
                  Don’t have an account?{" "}
                  <a href="/signup" className="link">Sign up now</a>
                </p>
              </div>
            </div>
          </main>

          {/* ----- footer ----- */}
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

export default PlayerLogin;
