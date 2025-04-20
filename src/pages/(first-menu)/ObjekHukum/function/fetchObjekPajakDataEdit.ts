import axios from "axios";

interface Mapping {
  objek_pajak_detail_ids: number[];
  is_badan_usaha: boolean;
}

interface AkunObjekPajakEditRequest {
  akun_perkiraan_detail_id: number;
  mappings: Mapping[];
}

export const editAkunObjekPajak = async (
  companyId: string,
  data: AkunObjekPajakEditRequest,
  token: string
) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:5000/akun-objek-pajak/${companyId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = response.data;

    if (!responseData.success) {
      throw new Error(responseData.message || "Request failed");
    }

    return responseData.data;
  } catch (error: any) {
    console.error("Error editing akun objek pajak:", error.response?.data?.errors?.[0]);
    throw new Error(error.response?.data?.errors?.[0] || "Edit akun objek pajak failed");
  }
};
