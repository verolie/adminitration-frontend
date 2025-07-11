import { TableRow } from "../model/laporanNeracaModel";

interface FetchLaporanNeracaParams {
  companyId: string;
}

export const fetchLaporanNeraca = async (
  params: FetchLaporanNeracaParams,
  token: string
): Promise<TableRow[]> => {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/laporan-neraca/${params.companyId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch laporan neraca data");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching laporan neraca:", error);
    throw error;
  }
}; 