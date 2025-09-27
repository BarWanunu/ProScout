import React, { useState } from "react";
import { Search, Users, User, Calendar, Video, BarChart3 } from "lucide-react";
import PlayerSearchTab from "./PlayerSearchTab";
import PlayerTrialsTab from "./PlayerTrialsTab";
import PlayerRecommendationsTab from "./PlayerRecommendationsTab";
import PlayerHighlightsTab from "./PlayerHighlightsTab";
import PlayerStatsTab from "./PlayerStatsTab";
import "../styles/PlayerDashboardTabs.css";

export default function PlayerDashboardTabs({ player }) {
  const [activeTab, setActiveTab] = useState("search");

  const switchToTab = (tabId) => {
    setActiveTab(tabId);
  };

  const tabs = [
    { 
      id: "search", 
      label: "Search", 
      icon: <Search size={18} /> 
    },
    { 
      id: "stats", 
      label: "Stats", 
      icon: <BarChart3 size={18} /> 
    },
    { 
      id: "trials", 
      label: "Trials", 
      icon: <Calendar size={18} /> 
    },
    { 
      id: "recommendations", 
      label: "Recommendations", 
      icon: <Users size={18} /> 
    },
     { 
      id: "highlights", 
      label: "Highlights", 
      icon: <Video size={18} /> 
    },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case "search":
        return <PlayerSearchTab player={player} />;
      case "stats":
        return <PlayerStatsTab player={player} />;
      case "recommendations":
        return <PlayerRecommendationsTab player={player} />;
      case "trials":
        return <PlayerTrialsTab player={player} />;
      case "highlights":
        return <PlayerHighlightsTab player={player} />;
      default:
        return <PlayerSearchTab player={player} />;
    }
  };

  return (
    <div className="player-dashboard-tabs">
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

      {/* Tab Content */}
      <div className="tab-content player-container">
        {renderTabContent()}
      </div>
    </div>
  );
}