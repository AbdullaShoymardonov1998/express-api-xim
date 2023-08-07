// Require necessary packages
const express = require("express");
const app = express();
const port = 3000;
const users = require("./src/routes/user");

app.use(express.json());

// User create
app.use(users);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
