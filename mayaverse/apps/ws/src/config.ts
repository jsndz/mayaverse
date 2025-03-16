import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const PORT = process.env.PORT;
export const DEV_URL = process.env.PORT;
export const STATE = process.env.STATE;
export const PROD_URL = process.env.PROD_URL;
