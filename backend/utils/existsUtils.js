exports.checkFieldExists = async (res, finderFn, field, value) => {
  const existing = await finderFn(field, value);
  if (existing) {
    const label = field === "user_id" ? "User" : field.replace("_", " ");
    res.status(409).json({ message: `${label} already in use.` });
    return true;
  }
  return false;
};
