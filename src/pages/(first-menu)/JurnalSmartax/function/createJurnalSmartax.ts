import axios from "axios";

interface JurnalSmartaxData {
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

export const createJurnalSmartax = async (data: JurnalSmartaxData, token: string) => {
  try {
    const requestData = {
      company_id: data.companyId,
      tgl: data.tgl,
      total_debit: data.totalDebit,
      total_kredit: data.totalKredit,
      deskripsi: data.deskripsi,
      file: data.file,
      jurnal_detail: data.jurnalDetail.map((detail) => ({
        lawan_transaksi: detail.lawanTransaksi,
        bukti: detail.bukti,
        debit: detail.debit,
        kredit: detail.kredit,
        urut: detail.urut,
        keterangan: detail.keterangan,
      })),
    };

    const response = await axios.post(
      "http://127.0.0.1:5000/jurnal",
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = response.data;

    if (responseData.success === false) {
      throw new Error(responseData.message || "Create jurnal smartax gagal");
    }

    return responseData.message;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors?.[0] || error.message);
    throw new Error(error.response?.data?.errors?.[0] || "Create jurnal smartax gagal");
  }
}; 