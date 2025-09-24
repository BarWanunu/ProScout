import React, { useState } from "react";
import { ScoutSearch } from "@/components/search";
import ScoutTrials from "./ScoutTrials";
import "../styles/ScoutDashboardTabs.css";
import "../styles/ScoutContainer.css";

export default function ScoutDashboardTabs({ scout }) {
  const [activeTab, setActiveTab] = useState("search");

  const tabs = [
    { id: "search", label: "Search 🔍", icon: "search" },
    { id: "trials", label: "Trials Invitations 📋", icon: "trials" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "search":
        return <ScoutSearch />;
      case "trials":
        return <ScoutTrials scout={scout} />;
      default:
        return <ScoutSearch />;
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
              onClick={() => setActiveTab(tab.id)}
            >
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