import React, { useState } from "react";
import { Search, Star, ClipboardList, Users, User } from "lucide-react";
import { TeamSearch } from "@/components/search";
import "@/components/search/styles/SearchFixGlobal.css";
import TrialsTab from "./TrialsTab";
import ShortlistTab from "./ShortlistTab";
import RecommendationTab from "./RecommendationTab";
import "../styles/TeamDashboardTabs.css";
import "../styles/TeamContainer.css";

export default function TeamDashboardTabs({ team, trials, shortlist, onRefreshShortlist, onRefreshTrials }) {
  const [activeTab, setActiveTab] = useState("search");
  // Remove single refreshKey and create separate flags for each tab to track refreshes
  const [forceRefresh, setForceRefresh] = useState({
    search: false,
    trials: false,
    recommendations: false,
    shortlist: false
  });

  // Update to refresh data when switching tabs
  const switchToTab = (tabId) => {
    
    // Only proceed if we're actually changing tabs
    if (tabId !== activeTab) {
      // Update active tab
      setActiveTab(tabId);
      
      // Then handle refreshes
      if (tabId === "trials" && onRefreshTrials) {
        onRefreshTrials();
      }
      
      if (tabId === "shortlist" && onRefreshShortlist) {
        onRefreshShortlist();
      }
      
      // Update the force refresh flag for this tab
      setForceRefresh(prev => ({
        ...prev,
        [tabId]: !prev[tabId]
      }));
    }
  };

  const tabs = [
    { 
      id: "search", 
      label: "Search", 
      icon: <Search size={18} /> 
    },
    { 
      id: "trials", 
      label: "Trials Invitations", 
      icon: <ClipboardList size={18} /> 
    },
    { 
      id: "recommendations", 
      label: "Recommendations", 
      icon: <Users size={18} /> 
    },
    { 
      id: "shortlist", 
      label: "Shortlist", 
      icon: <Star size={18} /> 
    },
  ];

  // Removed renderTabContent function as we're now using conditional rendering directly

  return (
    <div className="team-dashboard-tabs">
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <div className="tab-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => switchToTab(tab.id)}
            >
              {tab.icon}
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content - Using conditional display instead of a function to maintain state */}
      <div className="tab-content team-container">
        {activeTab === "search" && (
          <TeamSearch 
            onRefreshShortlist={onRefreshShortlist} 
            team={team} 
          />
        )}
        
        {activeTab === "trials" && (
          <TrialsTab 
            trials={trials} 
            onTrialUpdate={onRefreshTrials} 
          />
        )}
        
        {activeTab === "recommendations" && (
          <RecommendationTab 
            team={team} 
          />
        )}
        
        {activeTab === "shortlist" && (
          <ShortlistTab 
            shortlist={shortlist} 
            team={team}
            onSwitchToSearch={() => switchToTab("search")}
            onRefreshShortlist={onRefreshShortlist}
          />
        )}
      </div>
    </div>
  );
}