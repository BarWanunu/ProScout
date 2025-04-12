import React from 'react';
import { Routes, Route} from 'react-router-dom';
import LandingPage from './container/LandingPage';
import { PlayerLogin, ScoutLogin, TeamLogin } from './components/loginPages';
import PlayerDashboard from './container/PlayerDashboard';
import ScoutDashboard from './container/ScoutDashboard';
import TeamDashboard from './container/TeamDashboard';
import SignupPage from './container/SignupPage'

function App() {
  return (
    <Routes>
      <Route path="/*" element={<LandingPage />}/>
      <Route path="login/player" element={<PlayerLogin />}/>
      <Route path="login/scout" element={<ScoutLogin/>}/>
      <Route path="login/team" element={<TeamLogin />}/>
      <Route path="/player-dashboard" element={<PlayerDashboard />}/>
      <Route path="/scout-dashboard" element={<ScoutDashboard />}/>
      <Route path="/team-dashboard" element={<TeamDashboard />}/>
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  )
}

export default App
