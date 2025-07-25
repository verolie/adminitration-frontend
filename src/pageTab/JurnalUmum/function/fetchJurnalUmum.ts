import axios from "axios";
import { JurnalUmum } from "../model/JurnalUmumModel";
import { API_BASE_URL } from "@/utils/config";

type FilterOperator = "equals" | "contains" ; // Tambah kalau ada lagi

type FilterValue = {
  value: string;
  operator: FilterOperator;
};

type FilterInput = Record<string, FilterValue>;

export const fetchJurnal = async (
  data: JurnalUmum,
  token: string,
  filter?: FilterInput
) => {
  return await fetchJurnalUmumBackend(data, token, filter);
};

const fetchJurnalUmumBackend = async (
  data: JurnalUmum,
  token: string,
  filter?: FilterInput
) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/jurnal/${data.companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        page: data.page ?? 1,
        limit: data.limit ?? 20,
        ...(filter ? { filter: JSON.stringify(filter) } : {}),
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
