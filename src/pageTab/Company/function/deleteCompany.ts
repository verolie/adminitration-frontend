import axios from "axios";
import { CompanyModel } from "../model/companyModel";
import { API_BASE_URL } from "@/utils/config";

export const deleteCompany = async (data: CompanyModel, token: string) => {
  return await deleteCompanyBackend(data, token);
};

const deleteCompanyBackend = async (data: CompanyModel, token: string) => {
  try {
    const requestData = {
      id: data.id,
    };

    const response = await axios.post(
      `${API_BASE_URL}/companies`,
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
