import axios from "axios";
import { AkunPerkiraan } from "@/pageTab/AkunPerkiraan/model/AkunPerkiraanModel";
import { API_BASE_URL } from "@/utils/config";

type FilterOperator = "equals" | "contains" | "startsWith" | "endsWith";

type FilterValue = {
  value: string;
  operator: FilterOperator;
};

type FilterInput = Record<string, FilterValue>;

export const fetchAkunPerkiraan = async (
  data: AkunPerkiraan,
  token: string,
  filter?: FilterInput
) => {
  return await fetchAkunPerkiraanBackend(data, token, filter);
};

const fetchAkunPerkiraanBackend = async (
  data: AkunPerkiraan,
  token: string,
  filter?: FilterInput
) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/akun-perkiraan/detail/${data.companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        company_id: data.companyId,
        page: data.page ?? 1,
        limit: data.limit ?? 100,
        is_preference: true,
        ...(filter ? { filter: JSON.stringify(filter) } : {}),
      },
    });

    const responseData = response.data.data;

    console.log(responseData);

    if (responseData.success === false) {
      throw new Error(responseData);
    }

    return responseData.data;
  } catch (error: any) {
    console.error("Error Response:", error);
    throw new Error(error.response?.data?.errors?.[0] || "Fetch akun perkiraan failed");
  }
};
