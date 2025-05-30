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

export const editJurnalSmartax = async (data: FormData, token: string) => {
  try {
    // Ambil jurnal_detail dari FormData
    const jurnalDetailStr = data.get('jurnal_detail');
    if (typeof jurnalDetailStr === 'string') {
      // Parse string JSON menjadi array objek
      const jurnalDetail = JSON.parse(jurnalDetailStr);
      // Format ulang jurnal_detail
      const formattedJurnalDetail = jurnalDetail.map((detail: any) => ({
        akun_perkiraan_detail_id: detail.akun_perkiraan_detail_id,
        bukti: detail.bukti,
        debit: Number(detail.debit),  // pastikan dalam bentuk number
        kredit: Number(detail.kredit), // pastikan dalam bentuk number
        urut: detail.urut,
        keterangan: detail.keterangan,
      }));
      // Update FormData dengan jurnal_detail yang sudah diformat
      data.set('jurnal_detail', JSON.stringify(formattedJurnalDetail));
    }

    const response = await axios.put(`http://127.0.0.1:5000/jurnal/${data.get('company_id')}`, data, {
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