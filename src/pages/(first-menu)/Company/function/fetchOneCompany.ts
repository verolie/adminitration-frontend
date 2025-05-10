import axios from "axios";
import { CompanyModel } from "../model/companyModel";

export const fetchOneCompany = async (data: CompanyModel, token: string | null, companyId: string | null) => {
  return await fetchOneCompanyBackend(data, token, companyId);
};

const fetchOneCompanyBackend = async (data: CompanyModel, token: string | null, companyId: string | null) => {
  try {

    const response = await axios.get(
      `http://127.0.0.1:5000/companies/${companyId}`,
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
