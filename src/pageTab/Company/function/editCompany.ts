import axios from "axios";
import { CompanyModel } from "../model/companyModel";
import { API_BASE_URL } from "@/utils/config";

export const editCompany = async (data: CompanyModel, token: string) => {
  return await editCompanyBackend(data, token);
};

const editCompanyBackend = async (data: CompanyModel, token: string) => {
  try {
    const requestData = {
      nama: data.nama,
      npwp: data.npwp,
      nik: data.nik,
      nitku: data.nitku,
      telepon: data.telepon,
      email: data.email
    };

    const response = await axios.put(
      `${API_BASE_URL}/companies/${data.id}`,
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

    return responseData;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response?.data?.errors[0] || error.message || "Company failed");
  }
};
