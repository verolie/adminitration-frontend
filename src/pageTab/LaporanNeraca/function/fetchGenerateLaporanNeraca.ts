import { API_BASE_URL } from "@/utils/config";

export async function fetchGenerateLaporanNeraca(
  companyId: string,
  token: string,
  startDate: string,
  endDate: string
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/laporan-neraca/${companyId}/generate_laporan?start_date=${startDate}&end_date=${endDate}`,
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
    return result.data || [];
  } catch (error) {
    console.error("Error fetching generate laporan neraca:", error);
    throw error;
  }
} 