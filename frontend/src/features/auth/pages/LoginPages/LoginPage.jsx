import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios"
import { ArrowLeftIcon } from "lucide-react";
import { ROLE_META } from "../../../../constants/roles";
import { FullScreenVideo } from "../../../../components/layout";
import landingVideo from "../../../../assets/landing.mp4";
import Logo from "../../../../assets/Logo";
import "../../../../styles/LoginStyles/LoginPage.css";

export default function LoginPage() {
    const { role } = useParams(); // "player" | "scout" | "team"
    const meta = ROLE_META[role];
    const nav  = useNavigate();
    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")

    if (!meta) return <Navigate to="/" replace />;  // unknown role → landing

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("")

        try {
            const res = await axios.post("http://localhost:3000/api/login", {
                email, 
                password
            })

            const {token, user} = res.data

            localStorage.setItem("token", token)
            localStorage.setItem("userRole", user.role)
            localStorage.setItem("userId", user.id)

            if(user.role === "scout" || "player" || "team") {
                nav(`/${user.role}-dashboard`)
            } else {
                setError("Unknnown role")
            }
        } catch (err) {
            const msg= err.respose?.data?.message || "Login failed. Please try again."
            setError(msg)
        }
    }; 

    return (
  <div className="login-page">
    <div className="bg-wrapper">
      <FullScreenVideo src={landingVideo} />
      <div className="overlay">
        {/* Header */}
        <header className="header">
          <button onClick={() => nav("/")} className="header__back">
            <ArrowLeftIcon className="h-5 w-5" />
            <span>&nbsp;Back</span>
          </button>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Logo className="h-10 w-10" />
            <h1 className="header__title">ProScout</h1>
          </div>
          <div style={{ width: "6rem" }} />
        </header>

        {/* Main */}
        <main className="main">
          <div className="form-wrap">
            <div className="form-icon" style={{ background: meta.accent }}>
              {<meta.icon className="text-white h-8 w-8" />}
            </div>
            <h2 className="form-title">{meta.label} Login</h2>

            <form onSubmit={handleLogin} style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label className="label">Email</label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="label">Password</label>
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div style={{ color: "red", textAlign: "center", fontSize: "0.9rem" }}>
                  {error}
                </div>
              )}

              <button className="btn" style={{ background: meta.accent }}>
                Sign In
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  </div>
);

}
