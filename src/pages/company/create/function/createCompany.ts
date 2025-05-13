import axios from "axios";
import { CompanyModel } from "../model/companyModel";

export const createCompany = async (data: CompanyModel, token: string) => {
  return await createCompanyBackend(data, token);
};

const createCompanyBackend = async (data: CompanyModel, token: string) => {
  try {
    const requestData = {
      nama: data.nama,
      unique_id: data.unique_id,
    };

    const response = await axios.post(
      `http://127.0.0.1:5000/companies`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    const responseData = response.data;

    console.log(responseData);

    if (responseData.success === false) {
      throw new Error(responseData.message);
    }

    return responseData;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response?.data?.errors[0] || error.message || "Company failed");
  }
}; 