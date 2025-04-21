function checkUserRole(res, user, expectedRole) {
  if (user.role !== expectedRole) {
    res.status(400).json({
      message: `User role mismatch. Must be ${user.role}`,
    });
    return false;
  }
  return true;
}

module.exports = { checkUserRole };
