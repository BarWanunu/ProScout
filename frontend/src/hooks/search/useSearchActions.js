import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import shortlistService from "@/api/services/shortlistService";
import { getToken } from "@/api/tokenStore";

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

  // State for quick message modal
  const [messageModalState, setMessageModalState] = useState({
    show: false,
    recipientId: null,
    recipientName: "",
    recipientType: "",
  });

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
          handleInviteToTrial(targetUser);
        },
        tooltip: "Invite player to a trial",
      };
      actions.push(inviteAction);
    }

    return actions;
  };

  const getPlayerActions = (targetUser) => {
    const actions = [...getCommonActions(targetUser)];

    actions.push({ type: "separator" });

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

  const getTeamActions = (targetUser) => {
    const actions = [...getCommonActions(targetUser)];

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

  const getActionsForUser = (targetUser) => {
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

  const handleSendMessage = (user) => {
    let recipientId = null;
    let recipientName = "";
    let recipientType = "";

    if (user.type === "player") {
      recipientId = user.originalResult?.player?.user_id;
      recipientName = user.name || "Player";
      recipientType = "Player";
    } else if (user.type === "team") {
      recipientId = user.originalResult?.user_id;

      recipientName = user.name || "Team";
      recipientType = "Team";
    } else if (user.type === "scout") {
      recipientId = user.originalResult?.user_id;
      recipientName =
        user.scout?.first_name && user.scout?.last_name
          ? `${user.scout.first_name} ${user.scout.last_name}`
          : user.name || "Scout";
      recipientType = "Scout";
    }
    if (recipientId) {
      setMessageModalState({
        show: true,
        recipientId,
        recipientName,
        recipientType,
      });
    } else {
      console.error("Could not find user_id for:", user);
      alert("Unable to send message - user information not available");
    }
  };

  const handleRecommendPlayer = (team) => {
    const teamId = team.team?.id || team.id;
    const teamName =
      team.team?.team_name || team.team_name || team.name || `Team ${teamId}`;

    setPlayerSelectModalState({
      show: true,
      teamId: teamId,
      teamName: teamName,
      isForTrial: false,
    });
  };

  const handlePlayerSelected = (player) => {
    const teamId = playerSelectModalState.teamId;
    const teamName = playerSelectModalState.teamName;
    const isForTrial = playerSelectModalState.isForTrial;
    setPlayerSelectModalState({
      show: false,
      teamId: null,
      teamName: null,
      isForTrial: false,
    });

    if (isForTrial) {
      const trialUrl = `/trial/create?playerId=${
        player.id
      }&playerName=${encodeURIComponent(
        player.name
      )}&teamId=${teamId}&teamName=${encodeURIComponent(
        teamName
      )}&scoutId=${currentUserId}`;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

      navigate(trialUrl);
    } else {
      const recommendationUrl = `/recommendation/create?playerId=${
        player.id
      }&playerName=${encodeURIComponent(
        player.name
      )}&teamId=${teamId}&teamName=${encodeURIComponent(
        teamName
      )}&scoutId=${currentUserId}`;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

      navigate(recommendationUrl);
    }
  };

  const handleRecommendToTeam = (player) => {
    const playerId = player.player?.id || player.id;
    const playerName =
      player.player?.name ||
      player.name ||
      player.full_name ||
      `Player ${playerId}`;

    setTeamSelectModalState({
      show: true,
      playerId: playerId,
      playerName: playerName,
      isForTrial: false,
    });
  };

  const handleTeamSelected = (team) => {
    const playerId = teamSelectModalState.playerId;
    const playerName = teamSelectModalState.playerName;
    const isForTrial = teamSelectModalState.isForTrial;

    setTeamSelectModalState({
      show: false,
      playerId: null,
      playerName: null,
      isForTrial: false,
    });

    if (isForTrial) {
      const trialUrl = `/trial/create?playerId=${playerId}&playerName=${encodeURIComponent(
        playerName
      )}&teamId=${team.id}&teamName=${encodeURIComponent(
        team.name
      )}&scoutId=${currentUserId}`;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

      navigate(trialUrl);
    } else {
      const recommendationUrl = `/recommendation/create?playerId=${playerId}&playerName=${encodeURIComponent(
        playerName
      )}&teamId=${team.id}&teamName=${encodeURIComponent(
        team.name
      )}&scoutId=${currentUserId}`;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

      navigate(recommendationUrl);
    }
  };

  const handleInviteToTrial = (user) => {
    if (user.type === "player") {
      const playerId = user.player?.id || user.id;
      const playerName =
        user.player?.name ||
        user.name ||
        user.full_name ||
        `Player ${playerId}`;
      setTeamSelectModalState({
        show: true,
        playerId: playerId,
        playerName: playerName,
        isForTrial: true,
      });
    } else if (user.type === "team") {
      const teamId = user.team?.id || user.id;
      const teamName =
        user.team?.team_name || user.team_name || user.name || `Team ${teamId}`;
      setPlayerSelectModalState({
        show: true,
        teamId: teamId,
        teamName: teamName,
        isForTrial: true,
      });
    } else {
      console.error("Unsupported user type for trial invitation:", user.type);
      alert("Cannot invite this type of user to a trial");
    }
  };

  const handleRequestTrial = (user) => {
    if (user.type !== "team") {
      console.error("Can only request trials from teams");
      alert("Trial requests can only be sent to teams");
      return;
    }

    const teamId = user.team?.id || user.id;
    const teamName =
      user.team?.team_name || user.team_name || user.name || `Team ${teamId}`;

    const trialUrl = `/trial/create?playerId=${currentUserId}&teamId=${teamId}&teamName=${encodeURIComponent(
      teamName
    )}`;
    navigate(trialUrl);
  };

  const handleAddToShortlist = async (player) => {
    try {
      const token = getToken();
      const playerId = player.player_id || player.id;
      await shortlistService.addPlayer(playerId, token);
      alert(`${player.name} has been added to your shortlist successfully!`);
      if (onRefreshShortlist) {
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

  const closePlayerSelectModal = () => {
    setPlayerSelectModalState({
      show: false,
      teamId: null,
      teamName: null,
      isForTrial: false,
    });
  };

  const closeTeamSelectModal = () => {
    setTeamSelectModalState({
      show: false,
      playerId: null,
      playerName: null,
      isForTrial: false,
    });
  };

  const closeMessageModal = () => {
    setMessageModalState({
      show: false,
      recipientId: null,
      recipientName: "",
      recipientType: "",
    });
  };

  return {
    getActionsForUser,
    currentUserId,
    userRole: role,
    teamId: teamData?.id || (role === "team" ? currentUserId : null),
    playerSelectModal: playerSelectModalState,
    closePlayerSelectModal,
    handlePlayerSelected,
    teamSelectModal: teamSelectModalState,
    closeTeamSelectModal,
    handleTeamSelected,
    messageModal: messageModalState,
    closeMessageModal,
  };
};
