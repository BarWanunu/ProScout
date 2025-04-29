"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon, UsersIcon, EyeIcon, ArrowLeftIcon } from "lucide-react";
import Logo from "../../../assets/Logo";
import "../styles/SignupPage.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    position: "",
    age: "",
    teamName: "",
    location: "",
    organization: "",
    specialization: "",
  });

  /* ---------- handlers ---------- */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    navigate(`/${selectedRole}-dashboard`);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    const formEl = document.getElementById("signup-form");
    if (formEl) window.scrollTo({ top: formEl.offsetTop - 50, behavior: "smooth" });
  };

  /* ---------- helpers for class names ---------- */
  const cardClass = (role) =>
    `card card--${role} ${selectedRole === role ? `card--active-${role}` : ""}`;

  return (
    <div className="signup-page">
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
          {/* ---- header ---- */}
          <header className="header">
            <button onClick={() => navigate("/")} className="header__back">
              <ArrowLeftIcon className="h-5 w-5" />
              <span style={{ marginLeft: "0.5rem" }}>Back to Login</span>
            </button>

            <div style={{ display: "flex", alignItems: "center" }}>
              <Logo className="h-10 w-10" />
              <h1 className="header__title">ProScout</h1>
            </div>

            {/* empty spacer for flex symmetry */}
            <div style={{ width: "6rem" }} />
          </header>

          {/* ---- main ---- */}
          <main className="main">
            {/* role selection */}
            <section style={{ width: "100%", maxWidth: "80rem", marginBottom: "3rem" }}>
              <h2 className="main__headline">Choose your role</h2>

              <div className="role-grid">
                {/* player */}
                <div className={cardClass("player")} onClick={() => handleRoleSelect("player")}>
                  <div className="card__icon">
                    <UserIcon className="text-white h-8 w-8" />
                  </div>
                  <h3 className="card__title">Sign up as Player</h3>
                  <p className="card__text">
                    Showcase your skills, connect with teams, and take your career to the next level.
                  </p>
                </div>

                {/* team */}
                <div className={cardClass("team")} onClick={() => handleRoleSelect("team")}>
                  <div className="card__icon">
                    <UsersIcon className="text-white h-8 w-8" />
                  </div>
                  <h3 className="card__title">Sign up as Team</h3>
                  <p className="card__text">
                    Find the perfect talent for your roster and manage your team's recruitment process.
                  </p>
                </div>

                {/* scout */}
                <div className={cardClass("scout")} onClick={() => handleRoleSelect("scout")}>
                  <div className="card__icon">
                    <EyeIcon className="text-white h-8 w-8" />
                  </div>
                  <h3 className="card__title">Sign up as Scout</h3>
                  <p className="card__text">
                    Discover emerging talent, share your insights, and help shape the future of the sport.
                  </p>
                </div>
              </div>
            </section>

            {/* ----- form ----- */}
            <section id="signup-form" style={{ width: "100%", maxWidth: "40rem" }}>
              {selectedRole && (
                <div className={`form-wrap form--${selectedRole}`}>
                  {/* form heading */}
                  <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                    <div className="card__icon" style={{ margin: "0 auto 1rem" }}>
                      {selectedRole === "player" ? (
                        <UserIcon className="text-white h-8 w-8" />
                      ) : selectedRole === "team" ? (
                        <UsersIcon className="text-white h-8 w-8" />
                      ) : (
                        <EyeIcon className="text-white h-8 w-8" />
                      )}
                    </div>
                    <h2 className="form-title">
                      {selectedRole === "player"
                        ? "Player Registration"
                        : selectedRole === "team"
                        ? "Team Registration"
                        : "Scout Registration"}
                    </h2>
                  </div>

                  {/* --- the form itself --- */}
                  <form onSubmit={handleSubmit}>
                    {/* shared fields */}
                    <div className="form-grid two-col">
                      {selectedRole === "team" ? (
                        <div className="form-grid">
                          <label className="label" htmlFor="teamName">Team Name</label>
                          <input
                            className="input"
                            name="teamName"
                            id="teamName"
                            value={formData.teamName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      ) : (
                        <>
                          <div>
                            <label className="label" htmlFor="firstName">First Name</label>
                            <input
                              className="input"
                              name="firstName"
                              id="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div>
                            <label className="label" htmlFor="lastName">Last Name</label>
                            <input
                              className="input"
                              name="lastName"
                              id="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <label className="label" htmlFor="email">Email</label>
                    <input
                      className="input"
                      name="email"
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />

                    <div className="form-grid two-col">
                      <div>
                        <label className="label" htmlFor="password">Password</label>
                        <input
                          className="input"
                          name="password"
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="label" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                          className="input"
                          name="confirmPassword"
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* role-specific fields */}
                    {selectedRole === "player" && (
                      <div className="form-grid two-col">
                        <div>
                          <label className="label" htmlFor="position">Position</label>
                          <select
                            className="select"
                            name="position"
                            id="position"
                            value={formData.position}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select position</option>
                            <option value="forward">Forward</option>
                            <option value="midfielder">Midfielder</option>
                            <option value="defender">Defender</option>
                            <option value="goalkeeper">Goalkeeper</option>
                          </select>
                        </div>
                        <div>
                          <label className="label" htmlFor="age">Age</label>
                          <input
                            className="input"
                            name="age"
                            id="age"
                            type="number"
                            min="12"
                            max="50"
                            value={formData.age}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    )}

                    {selectedRole === "team" && (
                      <>
                        <label className="label" htmlFor="location">Location</label>
                        <input
                          className="input"
                          name="location"
                          id="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="City, Country"
                          required
                        />
                      </>
                    )}

                    {selectedRole === "scout" && (
                      <div className="form-grid two-col">
                        <div>
                          <label className="label" htmlFor="organization">Organization</label>
                          <input
                            className="input"
                            name="organization"
                            id="organization"
                            value={formData.organization}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div>
                          <label className="label" htmlFor="specialization">Specialization</label>
                          <select
                            className="select"
                            name="specialization"
                            id="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select specialization</option>
                            <option value="youth">Youth Development</option>
                            <option value="professional">Professional</option>
                            <option value="international">International</option>
                            <option value="performance">Performance Analysis</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* terms & submit */}
                    <div style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
                      <input id="terms" type="checkbox" className="checkbox" required />
                      <label htmlFor="terms" style={{ marginLeft: "0.5rem", color: "#d1d5db", fontSize: "0.875rem" }}>
                        I agree to the&nbsp;
                        <a className="link" href="/terms">Terms of Service</a> and&nbsp;
                        <a className="link" href="/privacy">Privacy Policy</a>
                      </label>
                    </div>

                    <button type="submit" className={`btn btn--${selectedRole}`}>
                      Create Account
                    </button>
                  </form>

                  {/* already have account */}
                  <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                    <p style={{ color: "#d1d5db", fontSize: "0.875rem" }}>
                      Already have an account?{" "}
                      <a href="/" className="link">Sign in</a>
                    </p>
                  </div>
                </div>
              )}
            </section>
          </main>

          {/* ---- footer ---- */}
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

export default SignupPage;
