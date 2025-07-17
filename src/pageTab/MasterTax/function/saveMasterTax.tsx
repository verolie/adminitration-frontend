import axios from "axios";
import { API_BASE_URL } from "@/utils/config";

export const saveMasterTax = async (
    companyId: string,
    akunPerkiraanDetailId: number,
    objekPajakId: number,
    token: string
  ) => {
    const url = `${API_BASE_URL}/akun-hutang-objek-pajak/${companyId}`; // Adjust the URL as needed
  
    const body = {
      akun_perkiraan_detail_id: akunPerkiraanDetailId,
      objek_pajak_id: objekPajakId,
    };
  
    try {
      const response = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      const responseData = response.data;
  
      if (!responseData.success) {
        throw new Error(responseData.message || "Unknown Error");
      }
  
      return responseData.data; // Return the response data if needed
    } catch (error: any) {
      console.error("Error Response:", error);
      throw new Error(error.response?.data?.errors?.[0] || "Save Master Tax failed");
    }
  };
  
  