import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../features/auth/pages/LandingPage';
import LoginPage from '../features/auth/pages/LoginPages/LoginPage';
import { InitialSignup, PlayerSignup, ScoutSignup, TeamSignup } from '../features/auth/pages/SignupPages'

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<InitialSignup />} />
      <Route path="/signup/player" element={<PlayerSignup />} />
      <Route path="/signup/scout" element={<ScoutSignup />} />
      <Route path="/signup/team" element={<TeamSignup />} />
      <Route path="/login/:role" element={<LoginPage />} />
    </Routes>
  )
}
export default AuthRoutes