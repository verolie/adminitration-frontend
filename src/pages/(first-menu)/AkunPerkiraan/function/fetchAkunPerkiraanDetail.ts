import axios from "axios";
import { AkunPerkiraan } from "../model/AkunPerkiraanModel";

export const fetchAkunPerkiraanDetail = async (data: AkunPerkiraan, token: string) => {
  return await fetchAkunPerkiraanBackend(data, token);
};

const fetchAkunPerkiraanBackend = async (data: AkunPerkiraan, token: string) => {
  try {
    const response = await axios.get(`http://127.0.0.1:5000/akun-perkiraan/detail/${data.companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        page: data.page ?? 1,
        limit: data.limit ?? 100,
      },
    });

    const responseData = response.data;

    if (!responseData.success) {
      throw new Error(responseData.message || "Unknown Error");
    }

    return responseData.data.data; 
  } catch (error: any) {
    console.error("Error Response:", error);
    throw new Error(error.response?.data?.errors?.[0] || "Fetch jurnal failed");
  }
};

