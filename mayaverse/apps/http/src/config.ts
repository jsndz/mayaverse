import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const PORT = process.env.PORT;
export const CLIENT_URL_PROD = process.env.CLIENT_URL_PROD;
export const CLIENT_URL_DEV = process.env.CLIENT_URL_DEV;
export const STATE = process.env.STATE;
