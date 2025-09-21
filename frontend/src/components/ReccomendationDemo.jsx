import React, { useEffect, useState } from "react";
import recommendationService from "@/api/services/recommendationService";
import playerService from "@/api/services/playerService";
import teamService from "@/api/services/teamService";
import scoutService from "@/api/services/scoutService";
import { useAuth } from "@/auth/AuthContext";

export default function RecommendationDemo() {
  const { role, id: userId, token } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileId, setProfileId] = useState(null);

  // שליפת פרופיל כדי להביא את ה-PK האמיתי
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (role === "player") {
          const res = await playerService.getPlayerById(userId, token);
          setProfileId(res.player.id);
        } else if (role === "team") {
          const res = await teamService.getTeamById(userId, token);
          setProfileId(res.team.id);
        } else if (role === "scout") {
          const res = await scoutService.getScoutById(userId, token);
          setProfileId(res.id);
        }
      } catch (err) {
        console.error("❌ Failed to fetch profile:", err);
      }
    };

    if (userId && token) fetchProfile();
  }, [role, userId, token]);

  // שליפת המלצות לפי פרופיל
  const fetchRecommendations = async () => {
    if (!profileId) return;

    try {
      setLoading(true);
      let data;

      if (role === "player") {
        data = await recommendationService.getRecommendationsByPlayer(profileId, token);
      } else if (role === "team") {
        data = await recommendationService.getRecommendationsByTeam(token);
      } else if (role === "scout") {
        data = await recommendationService.getRecommendationsByScout(token);
      }

      console.log("✅ Recommendations:", data);
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error("❌ Failed to fetch recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [profileId, token]);

  // מחיקת המלצה (רק לסקאוטים)
  const handleDelete = async (id) => {
    try {
      await recommendationService.deleteRecommendation(id, token);
      console.log("🗑️ Recommendation deleted:", id);
      fetchRecommendations();
    } catch (err) {
      console.error("❌ Failed to delete recommendation:", err);
    }
  };

  return (
    <div>
      <h3>Recommendations for {role} #{profileId}</h3>
      {loading ? (
        <p>Loading...</p>
      ) : recommendations.length === 0 ? (
        <p>No recommendations found</p>
      ) : (
        <ul>
          {recommendations.map((rec) => (
            <li key={rec.id} style={{ marginBottom: "15px" }}>
              <b>Player #{rec.player_id}</b> ➝ Team #{rec.teams_id} <br />
              Note: {rec.recommendation_note || "-"} <br />
              Scout ID: {rec.scout_id} <br />
              {/* כפתור מחיקה רק אם זה סקאוט */}
              {role === "scout" && (
                <button
                  style={{
                    marginTop: "5px",
                    background: "red",
                    color: "white",
                    padding: "4px 8px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDelete(rec.id)}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
