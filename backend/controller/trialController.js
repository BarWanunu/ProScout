const trialModel = require("../models/trialModels");
const { fetchUserProfile } = require("../utils/fetchUserProfile");

exports.createTrial = async (req, res) => {
  try {
    //prettier-ignore
    const {player_id, team_id,scout_id,invitation_message,trial_date} = req.body;

    const sender_role = req.user.role;

    //prettier-ignore
    const trial = await trialModel.createTrial(player_id,team_id,scout_id,invitation_message,trial_date,sender_role);

    //prettier-ignore
    if (!trial.success) {
      return res.status(500).json({ message: "Failed to create trial." });
    }

    //prettier-ignore
    res.status(201).json({ message: "Trial invitation created successfully.", trial: trial.data });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Server error while creating trial.", error: err.message });
  }
};

exports.updateTrialStatus = async (req, res) => {
  try {
    const validStatuses = ["pending", "accepted", "declined"];
    const { id } = req.params;
    const { status } = req.body;

    const profile = await fetchUserProfile(req.user);
    if (!profile)
      return res.status(403).json({ message: "Profile not found." });

    if (!status) {
      return res.status(400).json({ message: "Status is required." });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status value. Must be one of: pending, accepted, declined.",
      });
    }

    const trial = await trialModel.getTrialById(id);
    if (!trial.success || !trial.data)
      return res.status(404).json({ message: "Trial not found." });

    const trialData = trial.data;

    const playerId = req.user.role === "player" ? profile.id : 0;
    const teamId = req.user.role === "team" ? profile.id : 0;

    const isPlayerUpdating =
      req.user.role === "player" &&
      trialData.sender_role === "team" &&
      trialData.player_id === playerId;

    const isTeamUpdating =
      req.user.role === "team" &&
      ["player", "scout"].includes(trialData.sender_role) &&
      trialData.team_id === teamId;

    if (isPlayerUpdating || isTeamUpdating) {
      const updatedTrial = await trialModel.updateTrialStatus(id, status);

      //prettier-ignore
      if(!updatedTrial.success) {
        return res.status(500).json({message: 'Failed to update trial status.'})
      }

      //prettier-ignore
      return res.json({message: "Trial updated successfully",trial: updatedTrial.data});
    }

    //prettier-ignore
    return res.status(403).json({ message: "Unauthorized to update trial status." });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Server error while updating trial status.", error: err.message });
  }
};

exports.deleteTrial = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await fetchUserProfile(req.user);
    if (!profile)
      return res.status(403).json({ message: "Profile not found." });

    const trial = await trialModel.getTrialById(id);
    if (!trial.success || !trial.data)
      return res.status(404).json({ message: "Trial not found." });

    const trialsData = trial.data;

    const isPlayerDeleting =
      req.user.role === "player" && trialsData.player_id === profile.id;
    const isTeamDeleting =
      req.user.role === "team" && trialsData.team_id === profile.id;
    const isScoutDeleting =
      req.user.role === "scout" && trialsData.scout_id === profile.id;

    if (isPlayerDeleting || isTeamDeleting || isScoutDeleting) {
      const deletedTrial = await trialModel.deleteTrial(id);

      if (!deletedTrial.success) {
        return res.status(500).json({ message: "Failed to delete trial." });
      }

      //prettier-ignore
      return res.status(200).json({ message: "Trial deleted successfully", trial : deletedTrial.data });
    }

    return res.status(403).json({ message: "Unauthorized to delete trial" });
  } catch (err) {
    //prettier-ignore
    res.status(500).json({ message: "Server error while deleting trial.", error: err.message });
  }
};

exports.getTrialById = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await fetchUserProfile(req.user);
    if (!profile)
      return res.status(403).json({ message: "Profile not found." });

    const trial = await trialModel.getTrialById(id);
    if (!trial.success || !trial.data)
      return res.status(404).json({ message: "Trial not found." });

    const trialData = trial.data;

    const isPlayerViewing =
      req.user.role === "player" && trialData.player_id === profile.id;
    const isTeamViewing =
      req.user.role === "team" && trialData.team_id === profile.id;
    const isScoutViewing = req.user.role === "scout";

    if (isPlayerViewing || isTeamViewing || isScoutViewing) {
      return res.status(200).json({
        message: "Trial retrieved successfully.",
        trial: trialData,
      });
    }

    //prettier-ignore
    return res.status(403).json({ message: "Unauthorized to view this trial." });
  } catch (error) {
    //prettier-ignore
    res.status(500).json({message: "Server error while retrieving trial.",error: error.message});
  }
};

exports.getTrials = async (req, res) => {
  try {
    const { type, id } = req.params;
    const profile = await fetchUserProfile(req.user);
    if (!profile)
      return res.status(403).json({ message: "Profile not found." });

    if (type === "player") {
      const exists = await trialModel.playerExists(id);
      if (!exists)
        return res.status(404).json({ message: "Player not found." });

      const isPlayerViewing =
        req.user.role === "player" &&
        req.user.id === profile.user_id &&
        profile.id === parseInt(id, 10);

      const isScoutViewing = req.user.role === "scout"; // ← חסר בקוד שלך

      if (!(isPlayerViewing || isScoutViewing)) {
        return res
          .status(403)
          .json({ message: "Unauthorized to view this player's trials." });
      }

      const trials = await trialModel.getTrialsByPlayerId(id);
      return res.status(200).json({
        message: "Player trials retrieved successfully.",
        trials: trials.success ? trials.data : [],
      });
    }

    if (type === "team") {
      const exists = await trialModel.teamExists(id);
      if (!exists) return res.status(404).json({ message: "Team not found." });

      const isTeamViewing =
        req.user.role === "team" &&
        req.user.id === profile.user_id &&
        profile.id === parseInt(id, 10);

      if (!isTeamViewing) {
        return res
          .status(403)
          .json({ message: "Unauthorized to view this team trials." });
      }

      const trials = await trialModel.getTrialsByTeamId(id);
      return res.status(200).json({
        message: "Team trials retrieved successfully.",
        trials: trials.success ? trials.data : [],
      });
    }

    if (type === "scout") {
      const exists = await trialModel.scoutExists(id);
      if (!exists) return res.status(404).json({ message: "Scout not found." });

      const isSameScout =
        req.user.role === "scout" && profile.id === parseInt(id, 10);

      if (!isSameScout) {
        return res
          .status(403)
          .json({ message: "Unauthorized to view this scout's trials." });
      }

      const trials = await trialModel.getTrialsByScoutId(id);
      return res.status(200).json({
        message: "Scout trials retrieved successfully.",
        trials: trials.success ? trials.data : [],
      });
    }

    return res.status(400).json({
      message: "Invalid type parameter. Use 'player', 'team', or 'scout'.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while retrieving trials.",
      error: error.message,
    });
  }
};
