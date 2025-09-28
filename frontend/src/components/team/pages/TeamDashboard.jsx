import { useEffect, useState } from "react"  
import Header from "@/layout/overallLayout/Header.jsx";
import Footer from "@/layout/overallLayout/Footer.jsx";
import WelcomeSection from "@/components/common/WelcomeSection";
import TeamStats from "../components/TeamStats.jsx";
import TeamDashboardTabs from "../components/TeamDashboardTabs";
import teamService from "@/api/services/teamService";
import shortlistService from "@/api/services/shortlistService";
import trialService from "@/api/services/trialService";
import { getToken } from "@/api/tokenStore";
import "../styles/TeamDashboard.css";

export default function TeamDashboard() {
  const [fadeIn, setFadeIn] = useState(false);
  const [team, setTeam] = useState(null);
  const [shortlist, setShortlist] = useState([]);
  const [trials, setTrials] = useState([]); 

  useEffect(() => setFadeIn(true), []);

  // --- Fetch Team ---
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token = getToken();
        const userId = localStorage.getItem("id");
        if (!userId) return;

        const teamData = await teamService.getTeamById(userId, token);
        setTeam(teamData.team);
        // Set document title with team name when available
        if (teamData.team?.team_name) {
          document.title = `${teamData.team.team_name} - ProScout`;
        }
      } catch (err) {
        console.error("Error fetching team:", err);
      }
    };

    fetchTeam();
    
    // Reset document title when component unmounts
    return () => {
      document.title = "ProScout";
    };
  }, []);

   const fetchTrials = async () => {
    try {
      const token = getToken();
      if (!team) return;
      
      const trialsData = await trialService.getTrialsByTeam(team.id, token);      
      setTrials(trialsData.trials);      
    } catch (err) {
      console.error("Error fetching trials:", err);
    }
  };

  // --- Fetch Trials ---
  useEffect(() => {
    if (team) {
      fetchTrials();
    }
  }, [team]);

  // --- Fetch Shortlist ---
  const fetchShortlist = async () => {
    try {
      const token = getToken();
      const players = await shortlistService.getShortlist(token);
      setShortlist(players);
    } catch (err) {
      console.error("Error fetching shortlist:", err);
    }
  };

  useEffect(() => {
    if (team) {
      fetchShortlist();
    }
  }, [team]);

  // Direct fetch functions - no counter needed
  const refreshShortlist = async () => {
    await fetchShortlist();
  };
  
  const refreshTrials = async () => {
    await fetchTrials();
  };

  return (
    <>
      <Header profileId={team?.id} />
      <div className={`td-wrapper ${fadeIn ? "fade-in" : "fade-out"}`}>
        {/* ---------- WELCOME SECTION ---------- */}
        <WelcomeSection user={team} userType="team" imageStyle="square" />
        
        {/* ---------- TEAM STATS ---------- */}
        <TeamStats team={team} />
        
        {/* ---------- DASHBOARD TABS ---------- */}
        <div className="team-dashboard-container">
          <TeamDashboardTabs 
            team={team} 
            trials={trials} 
            shortlist={shortlist}
            onRefreshShortlist={refreshShortlist}
            onRefreshTrials={refreshTrials}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
