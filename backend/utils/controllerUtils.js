const { validateRequest } = require("./validationUtils");
const { getUser, getUserById } = require("./userUtils");

async function validateAndFetchUser(req, res, schema) {
  const value = validateRequest(schema, req, res);
  if (!value) return null;

  let user;
  if (req.user?.id) {
    user = await getUserById(req.user.id, res);
  } else {
    user = await getUser(value.username, res);
  }
  if (!user) return null;

  return { value, user };
}

module.exports = {
  validateAndFetchUser,
};
