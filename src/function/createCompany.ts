import axios from "axios";
import { CompanyModel } from "../model/companyModel";
import { API_BASE_URL } from "@/utils/config";

export const createCompany = async (data: CompanyModel, token: string) => {
  return await createCompanyBackend(data, token);
};

const createCompanyBackend = async (data: CompanyModel, token: string) => {
  try {
    const requestData = {
      nama: data.nama,
      npwp: data.npwp,
      nik: data.nik,
      nitku: data.nitku,
      telepon: data.telepon?.trim(),
      email: data.email?.trim()
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