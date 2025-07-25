import axios from "axios";
import { AkunPerkiraan } from "../model/AkunPerkiraanModel";
import { API_BASE_URL } from "@/utils/config";

// Tambahkan tipe Filter
type FilterOperator = "equals" | "contains" | "startsWith" | "endsWith";

type FilterValue = {
  value: string;
  operator: FilterOperator;
};

type FilterInput = Record<string, FilterValue>;

// Public function
export const fetchAkunPerkiraanSub = async (
  data: AkunPerkiraan,
  token: string,
  filter?: FilterInput
) => {
  return await fetchAkunPerkiraanBackend(data, token, filter);
};

// Backend call
const fetchAkunPerkiraanBackend = async (
  data: AkunPerkiraan,
  token: string,
  filter?: FilterInput
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/akun-perkiraan/sub/${data.companyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          page: data.page ?? 1,
          limit: data.limit ?? 100,
          ...(filter ? { filter: JSON.stringify(filter) } : {}),
        },
      }
    );

    const responseData = response.data;

    console.log(responseData.data?.[1]?.kode_akun);

    if (responseData.success === false) {
      throw new Error(responseData);
    }

    return responseData.data;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors?.[0]);
    throw new Error(error.response?.data?.errors?.[0] || "Fetch akun perkiraan sub failed");
  }
};
