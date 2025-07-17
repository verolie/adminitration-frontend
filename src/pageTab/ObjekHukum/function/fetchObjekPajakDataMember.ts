import axios from "axios";
import { InfoSubObjek } from "../model/objekHukumModel";
import { API_BASE_URL } from "@/utils/config";

type FilterOperator = "equals" | "contains" | "startsWith" | "endsWith";

type FilterValue = {
  value: string;
  operator: FilterOperator;
};

type FilterInput = Record<string, FilterValue>;

export const fetchObjekPajakDataMember = async (
  data: { companyId: string; page?: number; limit?: number; id?: number; isBadanUsaha?: boolean },
  token: string
): Promise<InfoSubObjek[]> => {
  let filter: FilterInput | undefined;

  if (data.id) {
    filter = {
      id: {
        value: data.id.toString(),
        operator: "equals",
      },
    };
  }

  if (data.isBadanUsaha !== undefined) {
    // Adding filter for is_badan_usaha
    filter = {
      ...filter,
      "objek_pajak_details.akun_objek_pajak.is_badan_usaha": {
        value: data.isBadanUsaha.toString(),
        operator: "equals",
      },
    };
  }

  return await fetchObjekObjekBackend(data, token, filter);
};

const fetchObjekObjekBackend = async (
  data: { companyId: string; page?: number; limit?: number },
  token: string,
  filter?: FilterInput
): Promise<InfoSubObjek[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/akun-objek-pajak/${data.companyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          page: data.page ?? 1,
          limit: data.limit ?? 20,
          ...(filter ? { filter: JSON.stringify(filter) } : {}),
        },
      }
    );

    const responseData = response.data.data;

    if (!responseData || responseData.success === false) {
      throw new Error("Gagal fetch data");
    }

    const mappedData: InfoSubObjek[] = responseData.data.map((item: any) => ({
      id: item.id.toString(),
      kodeAkun: item.kode_akun,
      namaAkun: item.nama_akun,
      keterangan: item.keterangan,
      detail:
        item.objek_pajak_details?.map((detail: any) => ({
          id: detail.id,
          kodeObjek: detail.kode_objek,
          namaObjek: detail.nama_objek,
          deskripsiObjek: detail.deskripsi_objek,
          persentase: detail.persentase,
          akunObjekPajakIsBadanUsaha: detail.akun_objek_pajak.is_badan_usaha, // Adding the "is_badan_usaha" status
        })) || [],
    }));

    return mappedData;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error.response?.data?.errors?.[0] || "Fetch objek pajak gagal"
    );
  }
};
