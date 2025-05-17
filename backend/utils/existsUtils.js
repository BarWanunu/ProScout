// existsUtils.js
exports.checkFieldExists = async (res, finderFn, field, value) => {
  try {
    const result = await finderFn(field, value);

    if (!result.success) {
      console.error("Error in checkFieldExists:", result.error);
      return false;
    }

    const existing = result.data;

    if (existing) {
      const label = field === "username" ? "Username" : "Email";
      res.status(409).json({
        message: `${label} already in use. Please choose a different ${label}`,
      });
      return true;
    }
    return false;
  } catch (err) {
    console.error("Error in checkFieldExists:", err);
    return false;
  }
};
