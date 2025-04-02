import axios from "axios";
import { User } from "../../../utils/model/userModel";

export const registerUser = async (user: User) => {
  return await createUserBackend(user);
};

const createUserBackend = async (user: User) => {
  try {
    const requestData = {
      username: user.username,
      email: user.email,
      password: user.password,
    };

    const response = await axios.post(
      `http://127.0.0.1:5000/users`,
      requestData
    );

    const responseData = response.data;

    console.log(responseData);

    if (responseData.success === false) {
      throw new Error(responseData.message);
    }

    return responseData.message;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.message);
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};
