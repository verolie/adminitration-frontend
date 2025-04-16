import axios from "axios";
import { JurnalUmum } from "../model/JurnalUmumModel";

type FilterOperator = "equals" | "contains" | "startsWith" | "endsWith"; // Tambah kalau ada lagi

type FilterValue = {
  value: string;
  operator: FilterOperator;
};

type FilterInput = Record<string, FilterValue>;

export const fetchJurnalDetail = async (
  data: JurnalUmum,
  token: string,
) => {
  return await fetchJurnalUmumDetailBackend(data, token);
};

const fetchJurnalUmumDetailBackend = async (
  data: JurnalUmum,
  token: string,
) => {
  try {
    const response = await axios.get(`http://127.0.0.1:5000/jurnal/${data.companyId}/${data.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
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
