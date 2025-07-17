import { TableRow } from "../model/laporanNeracaModel";
import { API_BASE_URL } from "@/utils/config";

interface FetchLaporanNeracaParams {
  companyId: string;
}

export const fetchLaporanNeraca = async (
  params: FetchLaporanNeracaParams,
  token: string
): Promise<TableRow[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/laporan-neraca/${params.companyId}`,
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