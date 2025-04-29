import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../features/auth/pages/LandingPage';
import SignupPage from '../features/auth/pages/SignupPage';
import { PlayerLogin, ScoutLogin, TeamLogin } from '../features/auth/pages';

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login/player" element={<PlayerLogin />} />
      <Route path="/login/scout" element={<ScoutLogin />} />
      <Route path="/login/team" element={<TeamLogin />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  )
}
export default AuthRoutes