import axios from "axios";

const url =
  process.env.NEXT_PUBLIC_STATE == "development"
    ? process.env.NEXT_PUBLIC_DEV_URL
    : process.env.NEXT_PUBLIC_PROD_URL;

export const signin = async (username: string, password: string) => {
  if (!username || !password) {
    console.error("Didnt get an user infos");
    return;
  }

  try {
    const res = await axios.post(`${url}/signin/`, {
      username,
      password,
    });

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signup = async (username: string, password: string) => {
  if (!username || !password) {
    console.error("Didnt get an user infos");
    return;
  }

  try {
    const res = await axios.post(`${url}/signup/`, {
      username,
      password,
      type: "user",
    });

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAvatars = async () => {
  try {
    const res = await axios.get(`${url}/avatars`);

    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUserMetadata = async (token: string, avatarId: string) => {
  try {
    const res = await axios.post(
      `${url}/user/metadata`,
      { avatarId },
      { headers: { authorization: `Bearer ${token}` } }
    );

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createAvatar = async (
  token: string,
  name: string,
  imageUrl: string
) => {
  try {
    const res = await axios.post(
      `${url}/admin/avatar`,
      { imageUrl, name },
      { headers: { authorization: `Bearer ${token}` } }
    );

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteAvatar = async (token: string, id: string) => {
  try {
    const res = await axios.delete(`${url}/admin/avatar`, {
      data: {
        id,
      },

      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createSpace = async (
  token: string,
  name: string,
  dimension: string,
  mapId?: string
) => {
  try {
    const res = await axios.post(
      `${url}/space/`,
      { name, dimension, mapId },
      { headers: { authorization: `Bearer ${token}` } }
    );

    return res.data.spaceId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllSpaces = async (token: string) => {
  try {
    const res = await axios.get(`${url}/space/all`, {
      headers: { authorization: `Bearer ${token}` },
    });

    return res.data.spaces;
  } catch (error) {
    console.error("Failed to fetch spaces:", error);
    throw error;
  }
};

export const getSpaceData = async (token: string, id: string) => {
  try {
    const res = await axios.get(`${url}/space/${id}`, {
      headers: { authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error) {
    console.error("Failed to fetch space:", error);
    throw error;
  }
};

export const getUsersMeta = async (token: string, userId: string) => {
  try {
    const res = await axios.get(`${url}/user/metadata/${userId}`, {
      headers: { authorization: `Bearer ${token}` },
    });

    return res.data.avatar;
  } catch (error) {
    console.error("Failed to get users metadata:", error);
    throw error;
  }
};

export const getUsersMetaBulk = async (token: string, userIds: string) => {
  try {
    const res = await axios.get(`${url}/user/metadata/bulk/${userIds}`, {
      headers: { authorization: `Bearer ${token}` },
    });

    return res.data.avatar;
  } catch (error) {
    console.error("Failed to get users metadata:", error);
    throw error;
  }
};
