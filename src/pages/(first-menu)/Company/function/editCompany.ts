import axios from "axios";
import { CompanyModel } from "../model/companyModel";

export const editCompany = async (data: CompanyModel, token: string) => {
  return await editCompanyBackend(data, token);
};

const editCompanyBackend = async (data: CompanyModel, token: string) => {
  try {
    const requestData = {
      nama: data.nama,
      unique_id: data.unique_id,
    };

    const response = await axios.put(
      `http://127.0.0.1:5000/companies/${data.id}`,
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
