import axios from "axios";
import { User } from "../model/userModel";

export const createUser = async (data: User, token: string) => {
  return await createData(data, token);
};

const createData = async (data: User, token: string) => {
  try {
    const requestData = {
      nama: data.nama,
    };

    const response = await axios.post(
      `http://127.0.0.1:5000/users`,
      requestData,
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

    return responseData.message;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors[0]);
    throw new Error(error.response?.data?.errors[0] || "Company failed");
  }
};
