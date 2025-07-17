import axios from "axios";
import { API_BASE_URL } from "@/utils/config";

export const deleteJurnalSmartax = async (companyId: string, id: string, token: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/jurnal/${companyId}/delete-one`,
    { id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}; 