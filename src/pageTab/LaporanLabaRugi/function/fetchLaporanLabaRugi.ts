import { TableRow } from "../model/laporanLabaRugiModel";
import { API_BASE_URL } from "@/utils/config";

interface FetchLaporanLabaRugiParams {
  companyId: string;
}

export const fetchLaporanLabaRugi = async (
  params: FetchLaporanLabaRugiParams,
  token: string
): Promise<TableRow[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/laporan-laba-rugi/${params.companyId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch laporan laba rugi data");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching laporan laba rugi:", error);
    throw error;
  }
}; 