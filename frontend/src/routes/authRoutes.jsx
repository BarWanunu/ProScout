import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../features/auth/pages/LandingPage';
import { PlayerLogin, ScoutLogin, TeamLogin } from '../features/auth/pages';
import InitialSignup from '../features/auth/pages/InitialSignup';
import PlayerSignup from '../features/auth/pages/PlayerSignup';
import ScoutSignup from '../features/auth/pages/ScoutSignup';
import TeamSignup from '../features/auth/pages/TeamSignup';

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<InitialSignup />} />
      <Route path="/signup/player" element={<PlayerSignup />} />
      <Route path="/signup/scout" element={<ScoutSignup />} />
      <Route path="/signup/team" element={<TeamSignup />} />
      <Route path="/login/player" element={<PlayerLogin />} />
      <Route path="/login/scout" element={<ScoutLogin />} />
      <Route path="/login/team" element={<TeamLogin />} />
      

    </Routes>
  )
}
export default AuthRoutes