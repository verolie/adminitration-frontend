import axios from "axios";
import { API_BASE_URL } from "@/utils/config";

interface JurnalSmartaxData {
  id: string;
  tgl: string;
  totalDebit: number;
  totalKredit: number;
  companyId: string;
  deskripsi: string;
  file: string;
  jurnalDetail: {
    lawanTransaksi: string;
    bukti: string;
    debit: number;
    kredit: number;
    urut: number;
    keterangan: string;
  }[];
}

export const editJurnalSmartax = async (formData: FormData, token: string) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/jurnal/${formData.get('company_id')}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const responseData = response.data;

    if (responseData.success === false) {
      throw new Error(responseData.message || 'Edit jurnal smartax gagal');
    }

    return responseData.message;
  } catch (error: any) {
    console.error('Error Response:', error.response?.data?.errors?.[0] || error.message);
    throw new Error(error.response?.data?.errors?.[0] || 'Edit jurnal smartax gagal');
  }
}; 