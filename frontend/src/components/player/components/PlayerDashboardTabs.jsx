import React, { useState } from "react";
import { Search, Users, User, BarChart3 } from "lucide-react";
import PlayerSearchTab from "./PlayerSearchTab";
import "../styles/PlayerDashboardTabs.css";

export default function PlayerDashboardTabs({ player, summary }) {
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
      label: "My Stats", 
      icon: <BarChart3 size={18} /> 
    },
    { 
      id: "messages", 
      label: "Messages", 
      icon: <User size={18} /> 
    },
    { 
      id: "profile", 
      label: "Profile", 
      icon: <Users size={18} /> 
    },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case "search":
        return <PlayerSearchTab player={player} />;
      case "stats":
        return (
          <div className="stats-content">
            <h3>Stats Summary (2022 - 2024)</h3>
            {summary ? (
              <div className="stats-display">
                <pre>{JSON.stringify(summary, null, 2)}</pre>
              </div>
            ) : (
              <p>Loading stats summary...</p>
            )}
          </div>
        );
      case "messages":
        return (
          <div className="messages-content">
            <h3>Messages</h3>
            <p>Messages functionality coming soon...</p>
          </div>
        );
      case "profile":
        return (
          <div className="profile-content">
            <h3>Profile Settings</h3>
            <p>Profile management coming soon...</p>
          </div>
        );
      default:
        return null;
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