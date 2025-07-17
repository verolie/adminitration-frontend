import axios from "axios";
import { API_BASE_URL } from "@/utils/config";

export const fetchCompanyMember = async (token: string, companyId: string | null) => {
  return await fetchCompanyMemberBackend(token, companyId);
};

const fetchCompanyMemberBackend = async (token: string, companyId: string | null) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/companies/get-members`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        params: {
          company_id: companyId
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
