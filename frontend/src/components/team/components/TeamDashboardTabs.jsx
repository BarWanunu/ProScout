import React, { useState } from "react";
import { Search, Star, CalendarDays, Users } from "lucide-react";
import { TeamSearch } from "@/components/search";
import "@/components/search/styles/SearchFixGlobal.css";
import TrialsTab from "./TrialsTab";
import ShortlistTab from "./ShortlistTab";
import RecommendationTab from "./RecommendationTab";
import "../styles/TeamDashboardTabs.css";
import "../styles/TeamContainer.css";

export default function TeamDashboardTabs({ team, trials, shortlist }) {
  const [activeTab, setActiveTab] = useState("search");

  const tabs = [
    { 
      id: "search", 
      label: "Search", 
      icon: <Search size={18} /> 
    },
    { 
      id: "trials", 
      label: "Trials", 
      icon: <CalendarDays size={18} /> 
    },
    { 
      id: "recommendations", 
      label: "Recommendations", 
      icon: <Star size={18} /> 
    },
    { 
      id: "shortlist", 
      label: "Shortlist", 
      icon: <Users size={18} /> 
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "search":
        return <TeamSearch />;
      case "trials":
        return <TrialsTab trials={trials} />;
      case "recommendations":
        return <RecommendationTab team={team} />;
      case "shortlist":
        return <ShortlistTab shortlist={shortlist} />;
      default:
        return <TeamSearch />;
    }
  };

  return (
    <div className="team-dashboard-tabs">
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <div className="tab-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content team-container">
        {renderTabContent()}
      </div>
    </div>
  );
}