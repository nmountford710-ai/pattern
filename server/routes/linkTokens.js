const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Project 1 backend basic test",
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
