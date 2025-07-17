import axios from "axios";
import { API_BASE_URL } from "@/utils/config";

type FilterOperator = "equals" | "contains"; // You can add more operators if needed
type FilterValue = {
  value: string | number;
  operator: FilterOperator;
};
type FilterInput = Record<string, FilterValue>;

export const fetchLawanTransaksiById = async (companyId: string, id: number) => {
  const token = localStorage.getItem("token");
  const filter: FilterInput = { id: { value: id, operator: "equals" } }; // Use the FilterInput type
  try {
    const res = await axios.get(`${API_BASE_URL}/lawan-transaksi/${companyId}`, { // Remove the filter from the URL
      headers: { Authorization: `Bearer ${token}` },
      params: {
        filter: JSON.stringify(filter), // Pass the filter as a parameter
      }
    });
    return res.data.data[0];
  } catch (error: any) {
     console.error("Error Response:", error);
     throw new Error(error.response?.data?.errors?.[0] || "Failed to fetch Lawan Transaksi");
  }
};
