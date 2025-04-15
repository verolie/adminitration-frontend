import axios from "axios";
import { ObjekHukumData } from "../model/objekHukumModel";

export const fetchObjekHukumData = async (data: ObjekHukumData, token: string) => {
  return await fetchObjekHukumBackend(data, token);
};

const fetchObjekHukumBackend = async (data: ObjekHukumData, token: string) => {
  try {
    const response = await axios.get(`http://127.0.0.1:5000/objek-pajak/all`, {
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
