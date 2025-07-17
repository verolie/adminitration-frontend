import axios from "axios";
import { User } from "../utils/model/userModel";
import { API_BASE_URL } from "@/utils/config";

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
      `${API_BASE_URL}/users`,
      requestData
    );

    const responseData = response.data;

    if (responseData.success === false) {
      throw new Error(responseData.message);
    }

    return responseData.message;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.message);
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};
