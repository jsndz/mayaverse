import express from "express";
import { router } from "./router/v1";
import { PORT, STATE, CLIENT_URL_PROD, CLIENT_URL_DEV } from "./config";
import cors from "cors";

let siteUrl = STATE === "development" ? CLIENT_URL_DEV : CLIENT_URL_PROD;
const corsOptions = {
  origin: (origin: any, callback: any) => {
    const allowedOrigins = [
      CLIENT_URL_DEV,
      CLIENT_URL_PROD,
      "http://localhost:3001",
      undefined,
    ];
    if (!origin || allowedOrigins.includes(origin)) {
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

app.use(cors(corsOptions));

app.use("/api/v1", router);
app.listen(PORT, () => {
  console.log(`server running in ${PORT}`);
});
