require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors');

const recommendationsRouter = require('./routes/recommendationsSystem');

require("./startup/routes")(app);
app.use("/uploads", express.static("uploads"));
app.use('/api/recommendations', recommendationsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
