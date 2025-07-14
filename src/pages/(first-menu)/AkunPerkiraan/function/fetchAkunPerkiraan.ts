import axios from "axios";
import { AkunPerkiraan } from "../model/AkunPerkiraanModel";

type FilterOperator = "equals" | "contains" ;

type FilterValue = {
  value: string | number;
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
    const response = await axios.get(`http://127.0.0.1:5000/akun-perkiraan/${data.companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        ...(filter ? { filter: JSON.stringify(filter) } : {}),
      },
    });

    const responseData = response.data;

    if (!responseData.success) {
      throw new Error(responseData.message || "Unknown Error");
    }

    return responseData.data;
  } catch (error: any) {
    console.error("Error Response:", error);
    throw new Error(error.response?.data?.errors?.[0] || "Fetch jurnal failed");
  }
};
