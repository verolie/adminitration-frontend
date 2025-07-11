interface BulkUpdateItem {
  laporan_neraca_id: number;
  akun_perkiraan_detail_ids: number[];
}

export const bulkUpdateLaporanNeraca = async (
  data: BulkUpdateItem[],
  token: string,
  companyId: string
): Promise<void> => {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/laporan-neraca/${companyId}/mapping`,
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
      throw new Error(errorData.message || "Failed to update laporan neraca data");
    }
  } catch (error) {
    console.error("Error updating laporan neraca:", error);
    throw error;
  }
}; 