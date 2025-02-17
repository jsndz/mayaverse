
import axios from "axios";

const url =
  process.env.NEXT_PUBLIC_STATE == "development"
    ? process.env.NEXT_PUBLIC_DEV_URL
    : process.env.NEXT_PUBLIC_PROD_URL;

const signin = async(username:string,password:string) => {
  if (!username || !password) {
    console.error("Didnt get an user infos");
    return;
  }

  try {
    const res = await axios.post(`${url}/signin/`,{
        username,
        password,
    });

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const signup = async(username:string,password:string) => {
  if (!username || !password) {
    console.error("Didnt get an user infos");
    return;
  }

  try {
    const res = await axios.post(`${url}/signup/`,{
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



export {
signin,signup
};