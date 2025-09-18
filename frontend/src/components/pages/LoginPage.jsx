import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { ROLE_META } from "../../data/roles"
import { FullScreenVideo } from "../../layout/overallLayout";
import landingVideo from "../../assets/landing.mp4";
import Logo from "../../assets/Logo";
import "../../styles/LoginPage.css";
import { useAuth } from "../../auth/AuthContext";
import { SignupService } from "../../api/services/signupServices";

const DASHBOARD_BY_ROLE = Object.freeze({
  player: "/player-dashboard",
  scout: "/scout-dashboard",
  team: "/team-dashboard",
});

export default function LoginPage() {
  const { role } = useParams();            
  const meta = ROLE_META[role];
  const nav  = useNavigate();
  const { login } = useAuth();

  const [leaving, setLeaving] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!meta) return <Navigate to="/" replace />;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await SignupService.login({ email, password });
      console.log("Login Success:", res)
      console.log(res.user.role);
      

      const prevHasFull = localStorage.getItem("hasFullProfile") === "true";

      login({
        token: res.token,
        role: res.user.role,
        id: res.user.id,
        hasFullProfile: prevHasFull,
      });

      setLeaving(true);
      setTimeout(() => {
        if (prevHasFull) {
          const target = DASHBOARD_BY_ROLE?.[res.user.role] ?? `/${res.user.role}-dashboard`;
          nav(target, { replace: true });
        } else {
          nav(`/signup/${res.user.role}`, { replace: true, state: { email } });
        }
      }, 220);
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
    }
  };

  return (
    <div className={`login-page ${leaving ? "fade-out-page" : ""}`}>
      <div className="bg-wrapper">
        <FullScreenVideo src={landingVideo} />
        <div className="overlay">
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

          <main className="main">
            <div className="form-wrap">
              <div className="form-icon" style={{ background: meta.accent }}>
                {meta?.icon && <meta.icon className="text-white h-8 w-8" />}
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
