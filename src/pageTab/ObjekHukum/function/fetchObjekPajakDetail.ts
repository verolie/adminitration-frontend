import axios from "axios";
import { ObjekHukumData } from "../model/objekHukumModel";
import { API_BASE_URL } from "@/utils/config";

export const fetchObjekPajakDetail = async (data: ObjekHukumData, token: string) => {
  return await fetchObjekPajakBackend(data, token);
};

const fetchObjekPajakBackend = async (data: ObjekHukumData, token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/objek-pajak`, {
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
