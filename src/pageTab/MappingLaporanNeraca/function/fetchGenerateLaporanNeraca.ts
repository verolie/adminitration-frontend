// Fetch function for Generate Laporan Neraca
import { API_BASE_URL } from "@/utils/config";

export interface GenerateLaporanNeracaRow {
    id: number;
    kode_akun: string;
    nama_akun: string;
    indent_num: number;
    is_header: boolean;
    nilai: number | boolean;
}

interface FetchGenerateLaporanNeracaParams {
  companyId: string;
}

export const fetchGenerateLaporanNeraca = async (
  params: FetchGenerateLaporanNeracaParams,
  token: string
): Promise<GenerateLaporanNeracaRow[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/laporan-neraca/${params.companyId}/generate_laporan`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch generate laporan neraca data");
    }

    const result = await response.json();

    // Validate the structure of the response
    if (!result || typeof result !== "object" || !Array.isArray(result.data)) {
      throw new Error("Invalid response format for generate laporan neraca");
    }

    const data = result;
    return data.data;
  } catch (error) {
    console.error("Error fetching generate laporan neraca:", error);
    throw error;
  }
}; 