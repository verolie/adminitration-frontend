import axios from "axios";
import { CompanyModel } from "../model/companyModel";

export const fetchCompany = async (data: CompanyModel, token: string | null) => {
  return await fetchCompanyBackend(data, token);
};

const fetchCompanyBackend = async (data: CompanyModel, token: string | null) => {
  try {

    const response = await axios.get(
      `http://127.0.0.1:5000/companies`,
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
