import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import shortlistService from "@/api/services/shortlistService";
import { getToken } from "@/api/tokenStore";
import PlayerSelectModal from "@/components/trials/PlayerSelectModal";
import TeamSelectModal from "@/components/trials/TeamSelectModal";

export const useSearchActions = ({
  onRefreshShortlist,
  teamData,
  onNavigateToProfile,
} = {}) => {
  const { role, id: currentUserId } = useAuth();
  const navigate = useNavigate();

  // State for player selection modal (for scout recommendations)
  const [playerSelectModalState, setPlayerSelectModalState] = useState({
    show: false,
    teamId: null,
    teamName: null,
  });

  // State for team selection modal (for scout recommending player to team OR inviting player to trial)
  const [teamSelectModalState, setTeamSelectModalState] = useState({
    show: false,
    playerId: null,
    playerName: null,
    isForTrial: false,
  });

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
      const inviteAction = {
        label: "Invite Player to Trial",
        icon: "⚽",
        className: "primary",
        onClick: () => {
          console.log("🎯 Invite action clicked for player:", targetUser);
          handleInviteToTrial(targetUser);
        },
        tooltip: "Invite player to a trial",
      };
      actions.push(inviteAction);
    }

    return actions;
  };

  // פעולות עבור שחקן
  const getPlayerActions = (targetUser) => {
    const actions = [...getCommonActions(targetUser)];

    // הוספת מפריד
    actions.push({ type: "separator" });

    // רק לקבוצות - לא לסקאוטים
    if (targetUser.type === "team") {
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

    if (onNavigateToProfile) {
      // Use profile navigation if available
      onNavigateToProfile(user.type, user.id);
    } else {
      // Fallback to navigation - all profiles use the entity ID, not user_id
      let profilePath;

      if (user.type === "team") {
        profilePath = `/team/profile/${user.id}`;
      } else if (user.type === "player") {
        profilePath = `/player/profile/${user.id}`;
      } else if (user.type === "scout") {
        profilePath = `/scout/profile/${user.id}`;
      } else {
        profilePath = "/";
      }

      console.log("Navigating to:", profilePath);
      navigate(profilePath);
    }
  };

  const handleSendMessage = (user) => {
    console.log("Sending message to:", user);
    // TODO: פתח חלון שליחת הודעה או נווט לדף ההודעות
    alert(`Opening message dialog for: ${user.name}`);
  };

  const handleRecommendPlayer = (team) => {
    console.log("Recommending player to team:", team);

    // Extract the team ID from the team object
    const teamId = team.team?.id || team.id;
    const teamName =
      team.team?.team_name || team.team_name || team.name || `Team ${teamId}`;

    // Show player selection modal for recommendation (not trial)
    setPlayerSelectModalState({
      show: true,
      teamId: teamId,
      teamName: teamName,
      isForTrial: false, // This is for recommendation, not trial
    });
  };

  // Handle when a player is selected from the PlayerSelectModal
  const handlePlayerSelected = (player) => {
    console.log("🔄 Player selected:", player);

    // Save team information before closing the modal
    const teamId = playerSelectModalState.teamId;
    const teamName = playerSelectModalState.teamName;
    const isForTrial = playerSelectModalState.isForTrial;

    console.log("📋 Data for action:", {
      teamId,
      teamName,
      playerId: player.id,
      playerName: player.name,
      isForTrial,
      currentState: playerSelectModalState,
    });

    // Close the player selection modal
    setPlayerSelectModalState({
      show: false,
      teamId: null,
      teamName: null,
      isForTrial: false,
    });

    if (isForTrial) {
      // Navigate to trial page with player and team data
      const trialUrl = `/trial/create?playerId=${
        player.id
      }&playerName=${encodeURIComponent(
        player.name
      )}&teamId=${teamId}&teamName=${encodeURIComponent(
        teamName
      )}&scoutId=${currentUserId}`;
      console.log("🚀 Navigating to trial page:", trialUrl);

      // Scroll to top automatically
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

      navigate(trialUrl);
    } else {
      // Navigate to recommendation page with player and team data
      const recommendationUrl = `/recommendation/create?playerId=${
        player.id
      }&playerName=${encodeURIComponent(
        player.name
      )}&teamId=${teamId}&teamName=${encodeURIComponent(
        teamName
      )}&scoutId=${currentUserId}`;
      console.log("🚀 Navigating to recommendation page:", recommendationUrl);

      // Scroll to top automatically
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

      navigate(recommendationUrl);
    }
  };

  const handleRecommendToTeam = (player) => {
    console.log("Recommending player to team:", player);

    // Extract player ID and name
    const playerId = player.player?.id || player.id;
    const playerName =
      player.player?.name ||
      player.name ||
      player.full_name ||
      `Player ${playerId}`;

    // Show team selection modal
    setTeamSelectModalState({
      show: true,
      playerId: playerId,
      playerName: playerName,
      isForTrial: false, // This is for recommendation, not trial
    });
  };

  // Handle when a team is selected from the TeamSelectModal
  const handleTeamSelected = (team) => {
    console.log("Team selected:", team);

    // Save player information before closing the modal
    const playerId = teamSelectModalState.playerId;
    const playerName = teamSelectModalState.playerName;
    const isForTrial = teamSelectModalState.isForTrial;

    // Log the data we're working with
    console.log("handleTeamSelected data:", {
      teamId: team.id,
      teamName: team.name,
      playerId: playerId,
      playerName: playerName,
      isForTrial: isForTrial,
    });

    // Close the team selection modal
    setTeamSelectModalState({
      show: false,
      playerId: null,
      playerName: null,
      isForTrial: false,
    });

    if (isForTrial) {
      // Navigate to trial creation page
      const trialUrl = `/trial/create?playerId=${playerId}&playerName=${encodeURIComponent(
        playerName
      )}&teamId=${team.id}&teamName=${encodeURIComponent(
        team.name
      )}&scoutId=${currentUserId}`;
      console.log("🚀 Navigating to trial page:", trialUrl);

      // Scroll to top automatically
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

      navigate(trialUrl);
    } else {
      // Navigate to recommendation creation page
      const recommendationUrl = `/recommendation/create?playerId=${playerId}&playerName=${encodeURIComponent(
        playerName
      )}&teamId=${team.id}&teamName=${encodeURIComponent(
        team.name
      )}&scoutId=${currentUserId}`;
      console.log("� Navigating to recommendation page:", recommendationUrl);

      // Scroll to top automatically
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

      navigate(recommendationUrl);
    }
  };

  const handleInviteToTrial = (user) => {
    console.log("🎯 Opening trial invitation for:", user);
    console.log("🔍 User type:", user.type);

    if (user.type === "player") {
      // When inviting a player - first open team selection modal
      const playerId = user.player?.id || user.id;
      const playerName =
        user.player?.name ||
        user.name ||
        user.full_name ||
        `Player ${playerId}`;

      console.log("🏃 Opening team selection modal for player trial:", {
        playerId,
        playerName,
      });

      // Show team selection modal for choosing a team for the player trial
      setTeamSelectModalState({
        show: true,
        playerId: playerId,
        playerName: playerName,
        isForTrial: true, // Flag to indicate this is for a trial, not recommendation
      });

      console.log("📊 Team modal state after setting:", {
        show: true,
        playerId: playerId,
        playerName: playerName,
        isForTrial: true,
      });
    } else if (user.type === "team") {
      // When scout invites a team
      const teamId = user.team?.id || user.id;
      const teamName =
        user.team?.team_name || user.team_name || user.name || `Team ${teamId}`;

      console.log(
        "🏆 Opening player selection modal for team trial:",
        teamName
      );

      // Open player selection modal for choosing a player for the team trial
      setPlayerSelectModalState({
        show: true,
        teamId: teamId,
        teamName: teamName,
        isForTrial: true, // Flag to indicate this is for a trial, not recommendation
      });
    } else {
      console.error(
        "❌ Unsupported user type for trial invitation:",
        user.type
      );
      alert("Cannot invite this type of user to a trial");
    }
  };

  const handleRequestTrial = (user) => {
    console.log("Requesting trial from:", user);

    // Check if the target is a team
    if (user.type !== "team") {
      console.error("Can only request trials from teams");
      alert("Trial requests can only be sent to teams");
      return;
    }

    // Get team ID from the user object
    const teamId = user.team?.id || user.id;
    const teamName =
      user.team?.team_name || user.team_name || user.name || `Team ${teamId}`;

    // Navigate to trial page for player requesting trial from team
    const trialUrl = `/trial/create?playerId=${currentUserId}&teamId=${teamId}&teamName=${encodeURIComponent(
      teamName
    )}`;
    console.log("🚀 Navigating to trial request page:", trialUrl);
    navigate(trialUrl);
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

  // Handler for closing player selection modal
  const closePlayerSelectModal = () => {
    setPlayerSelectModalState({
      show: false,
      teamId: null,
      teamName: null,
      isForTrial: false,
    });
  };

  // Handler for closing team selection modal
  const closeTeamSelectModal = () => {
    setTeamSelectModalState({
      show: false,
      playerId: null,
      playerName: null,
      isForTrial: false,
    });
  };

  return {
    getActionsForUser,
    currentUserId,
    userRole: role,
    teamId: teamData?.id || (role === "team" ? currentUserId : null),
    // Player selection modal state and handlers
    playerSelectModal: playerSelectModalState,
    closePlayerSelectModal,
    handlePlayerSelected,
    // Team selection modal state and handlers
    teamSelectModal: teamSelectModalState,
    closeTeamSelectModal,
    handleTeamSelected,
  };
};
