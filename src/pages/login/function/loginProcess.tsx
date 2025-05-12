import { encryptData } from "@/utils/encryption";
import { User } from "@/utils/model/userModel";
import axios from "axios";
import Cookies from "js-cookie";

export const loginProcess = async (data: User) => {
  const response = await loginUser(data);
  return response;
};

const loginUser = async (data: User) => {
  try {
    const requestData = {
      email: data.email,
      password: data.password,
      is_employee: data.isEmployee
    };

    const response = await axios.post(
      `http://127.0.0.1:5000/users/login`,
      requestData
    );

    const responseData = response.data;

    console.log(responseData);

    if (responseData.success === false) {
      throw new Error(responseData.message);
    }

    setCookies(responseData);
    setLocalStorage(responseData);

    return responseData;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.message);
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

const setCookies = (responseData: any) => {
  const encryptedSessionId = encryptData(responseData.data);

  Cookies.set("sessionId", encryptedSessionId, {
    expires: new Date(Date.now() + 15 * 60 * 1000),
    secure: true,
    sameSite: "Strict",
  });
};

const setLocalStorage = (responseData: any) => {
  localStorage.setItem("token", responseData.data.authenticationToken);
};
