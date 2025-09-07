import { Routes, Route } from 'react-router-dom';
import PlayerDashboard from '../components/player/pages/PlayerDashboard.jsx';
import ScoutDashboard from '../components/scout/pages/ScoutDashboard.jsx';
import TeamDashboard from '../components/team/pages/TeamDashboard.jsx';

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