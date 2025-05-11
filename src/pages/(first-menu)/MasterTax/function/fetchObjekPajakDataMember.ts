import axios from "axios";

type FilterOperator = "equals" | "contains" | "startsWith" | "endsWith";

type FilterValue = {
  value: string;
  operator: FilterOperator;
};

type FilterInput = Record<string, FilterValue>;

export const fetchObjekPajakData = async (
  data: { companyId: string; page?: number; limit?: number; id?: number; isBadanUsaha?: boolean },
  token: string
) => {
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
    filter = {
      ...filter,
      "is_badan_usaha": { // Perubahan disini
        value: data.isBadanUsaha.toString(),
        operator: "equals"
      }
    }
  }

  return await fetchObjekPajakBackend(data, token, filter);
};

const fetchObjekPajakBackend = async (
  data: { companyId: string; page?: number; limit?: number },
  token: string,
  filter?: FilterInput
) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:5000/objek-pajak/company/${data.companyId}`, // Endpointnya diubah
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

    const responseData = response.data; // Tidak perlu .data.data lagi

    if (!responseData || responseData.success === false) {
      throw new Error("Gagal fetch data");
    }

    const mappedData= responseData.data.map((item: any) => ({ // Mapping disesuaikan dengan response baru
      id: item.id.toString(),
      kodeObjek: item.kode_objek,
      namaObjek: item.nama_objek,
      deskripsiObjek: item.deskripsi_objek,
      persentase: 0, 
      ObjekPajakDetails: item.ObjekPajakDetails,
      akunObjekPajakIsBadanUsaha: false, 
      akunPerkiraanDetails: item.akun_perkiraan_hutang_details,
      isBadanUsaha: item.is_badan_usaha,
    }));

    return mappedData;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors?.[0]);
    throw new Error(
      error.response?.data?.errors?.[0] || "Fetch objek pajak gagal"
    );
  }
};
