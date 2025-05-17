const multer = require("multer");
const path = require("path");

const getUploadPath = (role) => {
  switch (role) {
    case "player":
      return "uploads/players";
    case "team":
      return "uploads/teams";
    case "scout":
      return "uploads/scouts";
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const role = req.user.role;
    const uploadPath = getUploadPath(role);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed"));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
