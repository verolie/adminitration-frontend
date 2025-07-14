export async function fetchGenerateLaporanNeraca(
  companyId: string,
  token: string,
  startDate: string,
  endDate: string
) {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/laporan-neraca/${companyId}/generate_laporan?start_date=${startDate}&end_date=${endDate}`,
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