import axios from "axios";
import { API_BASE_URL } from "@/utils/config";

export const fetchSmartTaxID = async (companyId: string, id: string, token: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/jurnal/${companyId}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};