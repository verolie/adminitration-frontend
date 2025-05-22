import axios from "axios";
import { AkunPerkiraan } from "../../AkunPerkiraan/model/AkunPerkiraanModel";

type FilterOperator = "equals" | "contains" | "startsWith" | "endsWith";

type FilterInput = {
  field: string;
  operator: FilterOperator;
  value: string;
};

export const fetchAkunPerkiraanDetail = async (
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
      value: item.id.toString(),
      label: `${item.kode_akun} - ${item.nama_akun}`,
    }));
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors?.[0]);
    throw new Error(error.response?.data?.errors?.[0] || "Fetch akun perkiraan failed");
  }
}; 