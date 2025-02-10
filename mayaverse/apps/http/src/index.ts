import express from "express";
import { router } from "./router/v1";
import { PORT } from "./config";
const app = express();
app.use(express.json());
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.json({
    message: "Hello",
  });
});

app.listen(PORT, () => {
  console.log(`server running in ${PORT}`);
});
