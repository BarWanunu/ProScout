const getMediaPath = (file) => {
  if (!file) return "";
  return file.path.replace(/\\/g, "/");
};

module.exports = { getMediaPath };
