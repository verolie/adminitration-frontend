import axios from "axios";
import { User } from "@/utils/model/userModel";
import { API_BASE_URL } from "@/utils/config";

export const createUser = async (data: User, token: string) => {
  return await createData(data, token);
};

const createData = async (data: User, token: string) => {
  try {
    const requestData = {
      username: data.username,
      email: data.email,
      password: data.password,
      company_id: localStorage.getItem("companyID")
    };

    const response = await axios.post(
      `${API_BASE_URL}/users/employees`,
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
