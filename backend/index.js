const express = require("express");
const app = express();
require("dotenv").config();

require("./startup/routes")(app);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
