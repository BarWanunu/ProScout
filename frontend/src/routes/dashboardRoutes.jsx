import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PlayerDashboard from '../features/player/pages/PlayerDashboard.jsx';
import ScoutDashboard from '../features/scout/pages/ScoutDashboard.jsx';
import TeamDashboard from '../features/team/pages/TeamDashboard.jsx';

function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/player-dashboard" element={<PlayerDashboard />} />
      <Route path="/scout-dashboard" element={<ScoutDashboard />} />
      <Route path="/team-dashboard" element={<TeamDashboard />} />
    </Routes>
  )
}
export default DashboardRoutes