import express from "express";

const app = express();

const PORT = process.env.PORT || 5001;

app.get("/", (_req, res) => {
  res.send("Hello");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
