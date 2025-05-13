// prettier-ignore
function checkUserRole(res, user, expectedRole, action = "perform this action") {
  if (user.role !== expectedRole) {
    res.status(400).json({
      message: `Unauthorized: User role mismatch. Must be ${user.role} to ${action}`,
    });
    return false;
  }
  return true;
}

module.exports = { checkUserRole };
