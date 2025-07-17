import axios from "axios";
import { API_BASE_URL } from "@/utils/config";

export const fetchOneCompany = async (token: string | null, companyId: string | null) => {
  return await fetchOneCompanyBackend(token, companyId);
};

const fetchOneCompanyBackend = async ( token: string | null, companyId: string | null) => {
  try {

    const response = await axios.get(
      `${API_BASE_URL}/companies/${companyId}`,
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
