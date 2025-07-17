import { API_BASE_URL } from "@/utils/config";

interface BulkUpdateItem {
    laporan_laba_rugi_id: number;
    akun_perkiraan_detail_ids: number[];
  }
  
  export const bulkUpdateLaporanLabaRugi = async (
    data: BulkUpdateItem[],
    token: string,
    companyId: string
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/laporan-laba-rugi/${companyId}/mapping`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update laporan laba rugi data");
      }
    } catch (error) {
      console.error("Error updating laporan laba rugi:", error);
      throw error;
    }
  }; 