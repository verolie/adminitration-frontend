import axios from "axios";

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

export const editJurnalSmartax = async (data: any, token: string) => {
  try {
    const formData = new FormData();
    formData.append('id', data.id);
    formData.append('faktur', data.faktur);
    formData.append('tgl', data.tgl);
    formData.append('total_debit', data.total_debit);
    formData.append('total_kredit', data.total_kredit);
    formData.append('lawan_transaksi_id', data.lawan_transaksi_id);
    formData.append('objek_pajak_id', data.objek_pajak_id);
    formData.append('jumlah_pajak', data.jumlah_pajak ?? '');
    formData.append('persentase_pajak', data.persentase_pajak ?? '');
    formData.append('dpp', data.dpp ?? '');
    formData.append('is_smart_tax', 'true');
    formData.append('jurnal_detail', data.jurnal_detail);
    if (data.file) {
      formData.append('file', data.file);
    }
    formData.append('company_id', data.company_id);
    formData.append('deskripsi', data.deskripsi || '');

    const response = await axios.put(`http://127.0.0.1:5000/jurnal/${data.company_id}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 