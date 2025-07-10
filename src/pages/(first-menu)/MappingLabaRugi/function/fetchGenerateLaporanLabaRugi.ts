// Fetch function for Generate Laporan Laba Rugi

export interface GenerateLaporanLabaRugiRow {
    id: number;
    kode_akun: string;
    nama_akun: string;
    indent_num: number;
    is_header: boolean;
    nilai_komersial: number | boolean;
    tidak_termasuk_objek_pajak: number | boolean;
    dikenakan_pph_bersifat_final: number | boolean;
    objek_pajak_tidak_final: number | boolean;
    penyesuaian_fiskal_positif: number | boolean;
    penyesuaian_fiskal_negatif: number | boolean;
    kode_penyesuaian_fiskal: number | boolean;
    nilai_fiskal: number | boolean;
}

interface FetchGenerateLaporanLabaRugiParams {
  companyId: string;
}

export const fetchGenerateLaporanLabaRugi = async (
  params: FetchGenerateLaporanLabaRugiParams,
  token: string
): Promise<GenerateLaporanLabaRugiRow[]> => {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/laporan-laba-rugi/${params.companyId}/generate_laporan`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch generate laporan laba rugi data");
    }

    const result = await response.json();

    // Validate the structure of the response
    if (!result || typeof result !== "object" || !Array.isArray(result.data)) {
      throw new Error("Invalid response format for generate laporan laba rugi");
    }

    const data = result;
    return data.data;
  } catch (error) {
    console.error("Error fetching generate laporan laba rugi:", error);
    throw error;
  }
}; 