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
      "http://192.168.79.197:3000",
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
app.get("/", (req, res) => {
  console.log("hello");
  res.send("Welcome to the API");
});
app.use("/api/v1", router);
app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`server running in http://192.168.79.197:${PORT}`);
});
