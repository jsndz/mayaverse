import axios from "axios";

const url =
  process.env.STATE == "development"
    ? process.env.DEV_URL
    : process.env.PROD_URL;

export const getUsersMeta = async (token: string, userIds: string) => {
  try {
    const res = await axios.get(`${url}/user/metadata/${userIds}`, {
      headers: { authorization: `Bearer ${token}` },
    });

    return res.data.avatar;
  } catch (error) {
    console.error("Failed to get users metadata:", error);
    throw error;
  }
};
