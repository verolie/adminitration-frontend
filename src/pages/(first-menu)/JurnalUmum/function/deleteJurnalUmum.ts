import axios from "axios";
import { JurnalUmum } from "../model/JurnalUmumModel";

export const deleteJurnalUmum = async (data: JurnalUmum, token: string) => {
  return await deleteCompanyBackend(data, token);
};

const deleteCompanyBackend = async (data: JurnalUmum, token: string) => {
  try {
    const requestData = {
      id: data.id,
    };

    const response = await axios.post(
      `http://127.0.0.1:5000/jurnal/${data.companyId}/delete-one`,
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
