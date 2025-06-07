import axios from "axios";
import type { JurnalSmartaxFormData } from '../model/jurnalSmartaxModel';

export const createJurnalSmartax = async (data: JurnalSmartaxFormData, token: string) => {
  try {
    const formData = new FormData();
    formData.append('faktur', data.faktur);
    formData.append('tgl', data.tgl);
    formData.append('total_debit', data.total_debit);
    formData.append('total_kredit', data.total_kredit);
    formData.append('lawan_transaksi_id', data.lawan_transaksi_id);
    formData.append('is_smart_tax', 'true');
    formData.append('jurnal_detail', data.jurnal_detail);
    formData.append('deskripsi', data.deskripsi || '');
    if (data.file) {
      formData.append('file', data.file);
    }

    const response = await axios.post(
      `http://127.0.0.1:5000/jurnal/${data.company_id}`,
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
      throw new Error(responseData.message || 'Create jurnal smartax gagal');
    }

    return responseData.message;
  } catch (error: any) {
    console.error('Error Response:', error.response?.data?.errors?.[0] || error.message);
    throw new Error(error.response?.data?.errors?.[0] || 'Create jurnal smartax gagal');
  }
}; 