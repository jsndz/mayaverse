import express from "express";
import { router } from "./router/v1";
import { PORT, STATE, CLIENT_URL_PROD, CLIENT_URL_DEV } from "./config";
import cors from "cors";

let siteUrl = STATE === "development" ? CLIENT_URL_DEV : CLIENT_URL_PROD;
const corsOptions = {
  origin: siteUrl,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};

const app = express();
app.use(express.json());

app.use("/api/v1", router);
app.use(cors());
app.get("/", (req, res) => {
  res.json({
    message: "Hello",
  });
});

app.listen(PORT, () => {
  console.log(`server running in ${PORT}`);
});
