import React, { useState, useEffect } from "react";
import Header from "../../../layout/overallLayout/Header";
import Footer from "../../../layout/overallLayout/Footer";
import ScoutWelcome from "../components/ScoutWelcome";
import ScoutSearch from "../components/ScoutSearch";
import scoutServices from "../../../api/services/scoutServices";
import { useAuth } from "@/auth/AuthContext";

export default function ScoutDashboard() {
  const { id, token } = useAuth();   // ← שולפים ישירות
  const [scout, setScout] = useState(null);

  useEffect(() => {
    const fetchScout = async () => {
      try {
        console.log("🔹 Fetching scout for userId:", id);
        const data = await scoutServices.getScoutById(id, token);
        console.log("✅ Scout response:", data);
        setScout(data);
      } catch (err) {
        console.error("❌ Failed to fetch scout data:", err);
      }
    };

    if (id && token) {
      fetchScout();
    } else {
      console.warn("⚠️ No userId or token found in AuthContext");
    }
  }, [id, token]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <ScoutWelcome scout={scout} />
      <ScoutSearch />
      <Footer />
    </div>
  );
}
