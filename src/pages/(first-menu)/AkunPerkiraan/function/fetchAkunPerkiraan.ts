import axios from "axios";
import { AkunPerkiraan } from "../model/AkunPerkiraanModel";

export const fetchAkunPerkiraan = async (data: AkunPerkiraan, token: string) => {
  return await fetchAkunPerkiraanBackend(data, token);
};

const fetchAkunPerkiraanBackend = async (data: AkunPerkiraan, token: string) => {
  try {
    const response = await axios.get(`http://127.0.0.1:5000/akun-perkiraan/${data.companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        page: data.page ?? 1,
        limit: data.limit ?? 100,
      }

    });

    const responseData = response.data;

    console.log(responseData.data[1].kode_akun);

    if (responseData.success === false) {
      throw new Error(responseData);
    }

    return responseData.data;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors?.[0]);
    throw new Error(error.response?.data?.errors?.[0] || "Fetch jurnal failed");
  }
};
