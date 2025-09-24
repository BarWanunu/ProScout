// All routes in a single file
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../components/pages/LandingPage'
import LoginPage from '../components/pages/LoginPage';
import { InitialSignup, PlayerSignup, ScoutSignup, TeamSignup } from '../components/pages/SignupPages'
import PlayerDashboard from '../components/player/pages/PlayerDashboard.jsx';
import ScoutDashboard from '../components/scout/pages/ScoutDashboard.jsx';
import TeamDashboard from '../components/team/pages/TeamDashboard.jsx';
import CreateTrialPage from '../components/trials/CreateTrialPage.jsx';
import { RequireAuth, RequireFullProfile } from "../auth/RouteGuards.jsx";

// All routes combined in a single Routes component
export const AllRoutes = () => (
  <Routes>
    {/* Auth routes */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/signup" element={<InitialSignup />} />
    <Route path="/signup/player" element={<PlayerSignup />} />
    <Route path="/signup/scout" element={<ScoutSignup />} />
    <Route path="/signup/team" element={<TeamSignup />} />
    <Route path="/login/:role" element={<LoginPage />} />
    
    {/* Dashboard routes */}
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
    
    {/* Trial routes */}
    <Route
      path="/trial/create"
      element={
        <RequireAuth>
          <RequireFullProfile>
            <CreateTrialPage />
          </RequireFullProfile>
        </RequireAuth>
      }
    />
  </Routes>
);