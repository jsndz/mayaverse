import express from "express";
import { router } from "./router/v1";
import { PORT, STATE, CLIENT_URL_PROD, CLIENT_URL_DEV } from "./config";
import cors from "cors";

let siteUrl = STATE === "development" ? CLIENT_URL_DEV : CLIENT_URL_PROD;
console.log("Site URL:", siteUrl);
const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (!origin || origin === CLIENT_URL_DEV || origin === CLIENT_URL_PROD) {
      console.log("CORS Origin Allowed:", origin);
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();
app.use(express.json());

app.use("/api/v1", router);
app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.json({
    message: "Hello",
  });
});

app.listen(PORT, () => {
  console.log(CLIENT_URL_DEV, STATE);

  console.log(`server running in ${PORT}`);
});
