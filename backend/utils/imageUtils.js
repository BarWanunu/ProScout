const getImagePath = (file) => {
  if (!file) return "";
  return file.path.replace(/\\/g, "/");
};

module.exports = { getImagePath };
