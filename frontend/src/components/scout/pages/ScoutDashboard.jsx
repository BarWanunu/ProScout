import React, { useState, useEffect } from "react";
import Header from "../../../layout/overallLayout/Header";
import Footer from "../../../layout/overallLayout/Footer";
import WelcomeSection from "@/components/common/WelcomeSection";
import ScoutDashboardTabs from "../components/ScoutDashboardTabs";
import scoutServices from "../../../api/services/scoutService";
import { useAuth } from "@/auth/AuthContext";

export default function ScoutDashboard() {
  const { id, token } = useAuth();
  const [scout, setScout] = useState(null);

  useEffect(() => {
    const fetchScout = async () => {
      try {
        const data = await scoutServices.getScoutById(id, token);
        setScout(data);
      } catch (err) {
        console.error("Failed to fetch scout data:", err);
      }
    };

    if (id && token) {
      fetchScout();
    } else {
    }
  }, [id, token]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <WelcomeSection user={scout} userType="scout" imageStyle="circle" />
      <ScoutDashboardTabs scout={scout} />
      <Footer />
    </div>
  );
}
