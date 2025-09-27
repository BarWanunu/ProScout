import React, { useState } from "react";
import { ScoutSearch } from "@/components/search";
import ScoutTrials from "./ScoutTrials";
import ScoutRecommendationsTab from "./ScoutRecommendationsTab";
import { Search, Calendar, Users } from 'lucide-react';
import "../styles/ScoutDashboardTabs.css";
import "../styles/ScoutContainer.css";

export default function ScoutDashboardTabs({ scout }) {
  const [activeTab, setActiveTab] = useState("search");
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Switch tab with automatic refresh
  const handleTabSwitch = (tabId) => {
    setActiveTab(tabId);
    setRefreshKey(prevKey => prevKey + 1);
  };

  const tabs = [
    { id: "search", label: "Search", icon: <Search size={18} style={{marginBottom:-2}} /> },
    { id: "trials", label: "Trials", icon: <Calendar size={18} style={{marginBottom:-2}} /> },
    { id: "recommendations", label: "Recommendations", icon: <Users size={18} style={{marginBottom:-2}} /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "search":
        return <ScoutSearch key={`search-${refreshKey}`} />;
      case "trials":
        return <ScoutTrials key={`trials-${refreshKey}`} scout={scout} />;
      case "recommendations":
        return <ScoutRecommendationsTab key={`recommendations-${refreshKey}`} />;
      default:
        return <ScoutSearch key={`search-${refreshKey}`} />;
    }
  };

  return (
    <div className="scout-dashboard-tabs">
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <div className="tab-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabSwitch(tab.id)}
            >
              {tab.icon && <span className="tab-icon me-1">{tab.icon}</span>}
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content scout-container">
        {renderTabContent()}
      </div>
    </div>
  );
}