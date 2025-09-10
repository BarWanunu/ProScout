// src/routes/dashboardRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import PlayerDashboard from '../components/player/pages/PlayerDashboard.jsx';
import ScoutDashboard from '../components/scout/pages/ScoutDashboard.jsx';
import TeamDashboard from '../components/team/pages/TeamDashboard.jsx';

import { RequireAuth, RequireFullProfile } from "../auth/AuthContext.jsx";

export default function DashboardRoutes() {
  return (
    <Routes>
      <Route
        path="/player-dashboard"
        element={
          <RequireAuth>
            <RequireFullProfile>
                <PlayerDashboard />
            </RequireFullProfile>
          </RequireAuth>
        }
      />
      <Route
        path="/scout-dashboard"
        element={
          <RequireAuth>
            <RequireFullProfile>
                <ScoutDashboard />
            </RequireFullProfile>
          </RequireAuth>
        }
      />
      <Route
        path="/team-dashboard"
        element={
          <RequireAuth>
            <RequireFullProfile>
                <TeamDashboard />
            </RequireFullProfile>
          </RequireAuth>
        }
      />
    </Routes>
  );
}
