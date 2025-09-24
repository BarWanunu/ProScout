import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import shortlistService from "@/api/services/shortlistService";
import { getToken } from "@/api/tokenStore";

export const useSearchActions = ({ onRefreshShortlist } = {}) => {
  const { role, id: currentUserId } = useAuth();
  const navigate = useNavigate();

  // פעולות כלליות שזמינות לכל המשתמשים
  const getCommonActions = (targetUser) => [
    {
      label: "View Profile",
      icon: "👤",
      className: "primary",
      onClick: () => handleViewProfile(targetUser),
      tooltip: "View user profile",
    },
    {
      label: "Send Message",
      icon: "💬",
      className: "success",
      onClick: () => handleSendMessage(targetUser),
      tooltip: "Send a message to this user",
    },
  ];

  // פעולות מיוחדות עבור סקאוט
  const getScoutActions = (targetUser) => {
    const actions = [...getCommonActions(targetUser)];

    // הוספת מפריד
    actions.push({ type: "separator" });

    if (targetUser.type === "team") {
      actions.push({
        label: "Recommend Player",
        icon: "🎯",
        className: "warning",
        onClick: () => handleRecommendPlayer(targetUser),
        tooltip: "Recommend a player to this team",
      });
      actions.push({
        label: "Invite Team to Trial",
        icon: "⚽",
        className: "primary",
        onClick: () => handleInviteToTrial(targetUser),
        tooltip: "Invite team to a trial",
      });
    } else if (targetUser.type === "player") {
      actions.push({
        label: "Recommend to Team",
        icon: "🎯",
        className: "warning",
        onClick: () => handleRecommendToTeam(targetUser),
        tooltip: "Recommend this player to a team",
      });
      actions.push({
        label: "Invite Player to Trial",
        icon: "⚽",
        className: "primary",
        onClick: () => handleInviteToTrial(targetUser),
        tooltip: "Invite player to a trial",
      });
    }

    return actions;
  };

  // פעולות עבור שחקן
  const getPlayerActions = (targetUser) => {
    const actions = [...getCommonActions(targetUser)];

    // הוספת מפריד
    actions.push({ type: "separator" });

    if (targetUser.type === "team" || targetUser.type === "scout") {
      actions.push({
        label: "Request Trial",
        icon: "⚽",
        className: "primary",
        onClick: () => handleRequestTrial(targetUser),
        tooltip: "Request a trial invitation",
      });
    }

    return actions;
  };

  // פעולות עבור קבוצה
  const getTeamActions = (targetUser) => {
    const actions = [...getCommonActions(targetUser)];

    // הוספת מפריד
    actions.push({ type: "separator" });

    if (targetUser.type === "player") {
      actions.push({
        label: "Add to Shortlist",
        icon: "⭐",
        className: "warning",
        onClick: () => handleAddToShortlist(targetUser),
        tooltip: "Add player to shortlist",
      });
      actions.push({
        label: "Invite to Trial",
        icon: "⚽",
        className: "primary",
        onClick: () => handleInviteToTrial(targetUser),
        tooltip: "Invite player to a trial",
      });
    }

    return actions;
  };

  // פונקציית העזר הראשית שמחזירה את הפעולות המתאימות
  const getActionsForUser = (targetUser) => {
    // אם המשתמש מנסה לבצע פעולות על עצמו - נציג רק פעולות מוגבלות
    if (targetUser.id === currentUserId) {
      return [
        {
          label: "View My Profile",
          icon: "👤",
          className: "primary",
          onClick: () => handleViewProfile(targetUser),
          tooltip: "View your own profile",
        },
      ];
    }

    switch (role) {
      case "scout":
        return getScoutActions(targetUser);
      case "player":
        return getPlayerActions(targetUser);
      case "team":
        return getTeamActions(targetUser);
      default:
        return getCommonActions(targetUser);
    }
  };

  // פונקציות הטיפול בפעולות
  const handleViewProfile = (user) => {
    console.log("Viewing profile of:", user);
    // Navigate to user profile based on user type
    const profilePath =
      user.type === "team"
        ? `/team/profile/${user.id}`
        : user.type === "player"
        ? `/player/profile/${user.id}`
        : user.type === "scout"
        ? `/scout/profile/${user.id}`
        : "/";
    // navigate(profilePath);
    alert(`Navigating to profile: ${user.name} (${user.type})`);
  };

  const handleSendMessage = (user) => {
    console.log("Sending message to:", user);
    // TODO: פתח חלון שליחת הודעה או נווט לדף ההודעות
    alert(`Opening message dialog for: ${user.name}`);
  };

  const handleRecommendPlayer = (team) => {
    console.log("Recommending player to team:", team);
    // TODO: פתח דיאלוג המלצה על שחקן
    alert(`Opening player recommendation dialog for team: ${team.name}`);
  };

  const handleRecommendToTeam = (player) => {
    console.log("Recommending player to team:", player);
    // TODO: פתח דיאלוג המלצה לקבוצה
    alert(`Opening team recommendation dialog for player: ${player.name}`);
  };

  const handleInviteToTrial = (user) => {
    console.log("Inviting to trial:", user);
    // TODO: פתח דיאלוג הזמנה למבחן
    alert(`Opening trial invitation dialog for: ${user.name} (${user.type})`);
  };

  const handleRequestTrial = (user) => {
    console.log("Requesting trial from:", user);
    // TODO: פתח דיאלוג בקשת מבחן
    alert(`Opening trial request dialog to: ${user.name} (${user.type})`);
  };

  const handleAddToShortlist = async (player) => {
    try {
      console.log("Adding to shortlist:", player);
      const token = getToken();
      const playerId = player.player_id || player.id;
      await shortlistService.addPlayer(playerId, token);
      alert(`${player.name} has been added to your shortlist successfully!`);
      // Refresh the shortlist if callback is provided
      if (onRefreshShortlist) {
        console.log("Refreshing shortlist after adding player...");
        await onRefreshShortlist();
      }
    } catch (error) {
      console.error("Failed to add player to shortlist:", error);
      if (error.response?.status === 400) {
        alert("This player is already in your shortlist.");
      } else {
        alert("Failed to add player to shortlist. Please try again.");
      }
    }
  };

  return {
    getActionsForUser,
    currentUserId,
    userRole: role,
  };
};
