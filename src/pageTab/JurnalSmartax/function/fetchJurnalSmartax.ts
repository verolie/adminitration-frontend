import axios from "axios";
import { API_BASE_URL } from "@/utils/config";

interface FetchParams {
  companyId: string;
  page?: number;
  limit?: number;
}

interface FetchResponse {
  data: any[];
  total: number;
}

export const fetchJurnalSmartax = async (params: FetchParams, token: string): Promise<FetchResponse> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/jurnal/smart-tax/${params.companyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
        },
      }
    );

    const responseData = response.data;

    if (responseData.success === false) {
      throw new Error(responseData.message || "Fetch jurnal smartax gagal");
    }

    return {
      data: responseData.data,
      total: responseData.total,
    };
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors?.[0] || error.message);
    throw new Error(error.response?.data?.errors?.[0] || "Fetch jurnal smartax gagal");
  }
}; 