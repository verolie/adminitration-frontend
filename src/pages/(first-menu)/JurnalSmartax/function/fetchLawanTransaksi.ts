import axios from "axios";
import { AkunPerkiraan } from "../../AkunPerkiraan/model/AkunPerkiraanModel";

type FilterOperator = "equals" | "contains" | "startsWith" | "endsWith";

type FilterValue = {
  value: string;
  operator: FilterOperator;
};

type FilterInput = Record<string, FilterValue>;

export const fetchAkunPerkiraanDetail = async (
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
    const response = await axios.get(`http://127.0.0.1:5000/lawan-transaksi/${data.companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        page: data.page ?? 1,
        limit: data.limit ?? 100,
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
    console.error("Error Response:", error.response?.data?.errors?.[0]);
    throw new Error(error.response?.data?.errors?.[0] || "Fetch akun perkiraan failed");
  }
};

interface LawanTransaksi {
  id: number;
  nama: string;
  npwp: string;
  nik: string | null;
  nitku: string | null;
  alamat: string;
  is_badan_usaha: boolean;
  created_at: string;
  updated_at: string;
}

export const fetchLawanTransaksi = async (token: string, companyId: string) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:5000/lawan-transaksi/${companyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = response.data;

    if (responseData.success === false) {
      throw new Error(responseData.message || "Fetch lawan transaksi gagal");
    }

    return responseData.data as LawanTransaksi[];
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors?.[0] || error.message);
    throw new Error(error.response?.data?.errors?.[0] || "Fetch lawan transaksi gagal");
  }
};
