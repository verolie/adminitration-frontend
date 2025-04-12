import axios from "axios";
import { User } from "../model/userModel";

export const fetchUser = async (data: User, token: string) => {
  return await fetchUserBackend(data, token);
};

const fetchUserBackend = async (data: User, token: string) => {
  try {

    const response = await axios.get(
      `http://127.0.0.1:5000/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    const responseData = response.data;

    console.log(responseData.data);

    if (responseData.success === false) {
      throw new Error(responseData);
    }

    return responseData.data;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors[0]);
    throw new Error(error.response?.data?.errors[0] || "Company failed");
  }
};
