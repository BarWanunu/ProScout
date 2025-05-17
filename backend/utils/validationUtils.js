exports.validateRequest = (schema, req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return null;
  }
  return value;
};
