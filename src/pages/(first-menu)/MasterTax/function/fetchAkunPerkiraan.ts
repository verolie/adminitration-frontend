import axios from "axios";
import { AkunPerkiraan } from "@/pages/(first-menu)/AkunPerkiraan/model/AkunPerkiraanModel";

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
        page: data.page ?? 1,
        limit: data.limit ?? 100,
        ...(filter ? { filter: JSON.stringify(filter) } : {}),
      },
    });

    const responseData = response.data;

    if (!responseData.success) {
      throw new Error(responseData.message || "Unknown Error");
    }

    console.log(responseData.data);

    // Map the response data to include id and kode_objek
    return responseData.data.map((item: any) => ({
      id: item.id, // Assuming the API returns an id field
      kode_objek: item.kode_akun, // Assuming the API returns a kode_objek field
      label: `${item.kode_akun} - ${item.nama_akun}`, // Adjust label as needed
      value: item.id, // Use id as the value
    }));
  } catch (error: any) {
    console.error("Error Response:", error);
    throw new Error(error.response?.data?.errors?.[0] || "Fetch jurnal failed");
  }
};

export const saveMasterTax = async (
  companyId: string,
  akunPerkiraanDetailId: number,
  objekPajakId: number,
  token: string
) => {
  const url = `http://127.0.0.1:5000/akun-hutang-objek-pajak/${companyId}`; // Adjust the URL as needed

  const body = {
    akun_perkiraan_detail_id: akunPerkiraanDetailId,
    objek_pajak_id: objekPajakId,
  };

  try {
    const response = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const responseData = response.data;

    if (!responseData.success) {
      throw new Error(responseData.message || "Unknown Error");
    }

    return responseData.data; // Return the response data if needed
  } catch (error: any) {
    console.error("Error Response:", error);
    throw new Error(error.response?.data?.errors?.[0] || "Save Master Tax failed");
  }
};
