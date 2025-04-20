import axios from "axios";
import { InfoSubObjek, SubObjek } from "../model/objekHukumModel";

export const fetchObjekObjekDataMember = async (
  data: { companyId: string; page?: number; limit?: number },
  token: string
): Promise<InfoSubObjek[]> => {
  return await fetchObjekObjekBackend(data, token);
};

const fetchObjekObjekBackend = async (
  data: { companyId: string; page?: number; limit?: number },
  token: string
): Promise<InfoSubObjek[]> => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:5000/akun-objek-pajak/${data.companyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          page: data.page ?? 1,
          limit: data.limit ?? 20,
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
      detail: item.objek_pajak_details?.map((detail: any) => ({
        id: detail.id,
        kodeObjek: detail.kode_objek,
        namaObjek: detail.nama_objek,
        deskripsiObjek: detail.deskripsi_objek,
        persentase: detail.persentase,
      })) || [],
    }));


    return mappedData;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors?.[0]);
    throw new Error(error.response?.data?.errors?.[0] || "Fetch objek hukum gagal");
  }
};
