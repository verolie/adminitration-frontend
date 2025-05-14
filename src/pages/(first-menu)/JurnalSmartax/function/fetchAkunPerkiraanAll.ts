import axios from "axios";
import { AkunPerkiraan } from "../../AkunPerkiraan/model/AkunPerkiraanModel";

export interface AkunPerkiraanItem {
  id: string;
  kode_akun: string;
  nama_akun: string;
}

type FilterOperator = "equals" | "contains" | "startsWith" | "endsWith";

type FilterValue = {
  value: string;
  operator: FilterOperator;
};

type FilterInput = Record<string, FilterValue>;

export const fetchAkunPerkiraanAll = async (
  data: { companyId: string },
  token: string,
  filter?: FilterInput
) => {
  try {
    const response = await axios.get(`http://127.0.0.1:5000/akun-perkiraan/detail/${data.companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        page: 1,
        limit: 100,
        ...(filter ? { filter: JSON.stringify(filter) } : {}),
      },
    });

    const responseData = response.data.data;

    if (responseData.success === false) {
      throw new Error(responseData);
    }

    return responseData.data.map((item: any) => ({
      id: item.id,
      kode_akun: item.kode_akun,
      nama_akun: item.nama_akun
    })) as AkunPerkiraanItem[];
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors?.[0]);
    throw new Error(error.response?.data?.errors?.[0] || "Fetch akun perkiraan failed");
  }
}; 