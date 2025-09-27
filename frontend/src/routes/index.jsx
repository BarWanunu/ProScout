import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../components/pages/LandingPage'
import LoginPage from '../components/pages/LoginPage';
import { InitialSignup, PlayerSignup, ScoutSignup, TeamSignup } from '../components/pages/SignupPages'
import PlayerDashboard from '../components/player/pages/PlayerDashboard.jsx';
import ScoutDashboard from '../components/scout/pages/ScoutDashboard.jsx';
import TeamDashboard from '../components/team/pages/TeamDashboard.jsx';
import CreateTrialPage from '../components/trials/CreateTrialPage.jsx';
import CreateRecommendationPage from '../components/recommendations/CreateRecommendationPage.jsx';
import { MessagesPage } from '../components/messages';
import PlayerProfilePage from '../components/profile/pages/PlayerProfilePage.jsx';
import ScoutProfilePage from '../components/profile/pages/ScoutProfilePage.jsx';
import TeamProfilePage from '../components/profile/pages/TeamProfilePage.jsx';
import { RequireAuth, RequireFullProfile, RoleGuard } from "../auth/RouteGuards.jsx";
import { useAuth } from "../auth/AuthContext";

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
            <RoleGuard allow={['player']}>
              <PlayerDashboard />
            </RoleGuard>
          </RequireFullProfile>
        </RequireAuth>
      }
    />
    <Route
      path="/scout-dashboard"
      element={
        <RequireAuth>
          <RequireFullProfile>
            <RoleGuard allow={['scout']}>
              <ScoutDashboard />
            </RoleGuard>
          </RequireFullProfile>
        </RequireAuth>
      }
    />
    <Route
      path="/team-dashboard"
      element={
        <RequireAuth>
          <RequireFullProfile>
            <RoleGuard allow={['team']}>
              <TeamDashboard />
            </RoleGuard>
          </RequireFullProfile>
        </RequireAuth>
      }
    />
    
    {/* Trial routes - accessible to all roles */}
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
    
    {/* Recommendation routes - primarily for scouts but teams can also access */}
    <Route
      path="/recommendation/create"
      element={
        <RequireAuth>
          <RequireFullProfile>
            <RoleGuard allow={['scout', 'team']}>
              <CreateRecommendationPage />
            </RoleGuard>
          </RequireFullProfile>
        </RequireAuth>
      }
    />
    
    {/* Messages routes */}
    <Route
      path="/messages"
      element={
        <RequireAuth>
          <RequireFullProfile>
            <MessagesPage />
          </RequireFullProfile>
        </RequireAuth>
      }
    />
    
    {/* Profile routes */}
    <Route
      path="/player/profile/:playerId"
      element={<PlayerProfilePage />}
    />
    <Route
      path="/scout/profile/:scoutId"
      element={<ScoutProfilePage />}
    />
    <Route
      path="/team/profile/:teamId"
      element={<TeamProfilePage />}
    />
    
    {/* Catch-all route - redirect to appropriate dashboard */}
    <Route
      path="*"
      element={
        <RequireAuth>
          <RequireFullProfile>
            <DashboardRedirect />
          </RequireFullProfile>
        </RequireAuth>
      }
    />
  </Routes>
);

// Component to redirect users to their appropriate dashboard
const DashboardRedirect = () => {
  const { role, DASHBOARD_BY_ROLE } = useAuth();
  const target = DASHBOARD_BY_ROLE[role] || "/";
  return <Navigate to={target} replace />;
};