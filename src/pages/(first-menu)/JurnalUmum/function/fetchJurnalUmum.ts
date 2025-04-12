import axios from "axios";
import { JurnalUmum } from "../model/jurnalUmumModel";

export const fetchJurnal = async (data: JurnalUmum, token: string) => {
  return await fetchJurnalUmumBackend(data, token);
};

const fetchJurnalUmumBackend = async (data: JurnalUmum, token: string) => {
  try {
    const response = await axios.get(`http://127.0.0.1:5000/jurnal/${data.companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        page: data.page ?? 1,
        limit: data.limit ?? 20,
      },
    });

    const responseData = response.data;

    console.log(responseData.data);

    if (responseData.success === false) {
      throw new Error(responseData);
    }

    return responseData.data;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors?.[0]);
    throw new Error(error.response?.data?.errors?.[0] || "Fetch jurnal failed");
  }
};
