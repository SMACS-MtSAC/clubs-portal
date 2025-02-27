import exp from "constants";
import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    status: "Healthy",
  });
});

app.listen(4004, () => {
  console.log(`Server running on port ${4004}`);
});
