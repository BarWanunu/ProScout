const { validateRequest } = require("./validationUtils");
const { getUser, getUserById } = require("./userUtils");

async function validateAndFetchUser(req, res, schema) {
  const value = validateRequest(schema, req, res);
  if (!value) return null;

  let user;
  if (req.user?.id) {
    user = await getUserById(req.user.id, res);
  } else if (value.username) {
    user = await getUser(value.username, res);
  } else {
    return res.status(400).json({
      message: "Token or username is required.",
    });
  }
  if (!user) return null;

  return { value, user };
}

module.exports = {
  validateAndFetchUser,
};
