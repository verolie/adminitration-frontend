import { TableRow } from "../model/laporanLabaRugiModel";

interface FetchLaporanLabaRugiParams {
  companyId: string;
}

export const fetchLaporanLabaRugi = async (
  params: FetchLaporanLabaRugiParams,
  token: string
): Promise<TableRow[]> => {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/laporan-laba-rugi/${params.companyId}`,
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