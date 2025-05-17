exports.checkFieldExists = async (finderFn, field, value) => {
  try {
    const result = await finderFn(field, value);

    if (!result.success) {
      console.error("Error in checkFieldExists:", result.error);
      return false;
    }

    if (!result.data) {
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error in checkFieldExists:", err.message);
    return false;
  }
};
