const { validateRequest } = require("./validationUtils");
const { getUser } = require("./userUtils");

async function validateAndFetchUser(req, res, schema) {
  const value = validateRequest(schema, req, res);
  if (!value) return null;

  const user = await getUser(value.username, res);
  if (!user) return null;

  return { value, user };
}

module.exports = {
  validateAndFetchUser,
};
