import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";

export const useSearchActions = () => {
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

  const handleAddToShortlist = (player) => {
    console.log("Adding to shortlist:", player);
    // TODO: הוסף לרשימת מועדפים
    alert(`Adding ${player.name} to shortlist`);
  };

  return {
    getActionsForUser,
    currentUserId,
    userRole: role,
  };
};
