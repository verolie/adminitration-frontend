import axios from "axios";
import { JurnalUmum } from "../model/JurnalUmumModel";

export const createJurnalUmum = async (data: JurnalUmum, token: string) => {
  return await createData(data, token);
};

const createData = async (data: JurnalUmum, token: string) => {
  try {
    const formData = new FormData();
    
    // Add basic fields
    // formData.append("company_id", data.companyId || "");
    formData.append("faktur", data.faktur || "");
    formData.append("tgl", data.tgl || "");
    formData.append("total_debit", data.totalDebit?.toString() || "0");
    formData.append("total_kredit", data.totalKredit?.toString() || "0");
    formData.append("deskripsi", data.deskripsi || "");
    formData.append("is_smart_tax", "false");
    
    // Add smart tax fields (empty as requested)
    // formData.append("lawan_transaksi_id", "");
    // formData.append("objek_pajak_id", "");
    // formData.append("jumlah_pajak", "0");
    // formData.append("persentase_pajak", "0");
    // formData.append("dpp", "0");

    // Add file if exists
    if (data.file) {
      formData.append("file", data.file);
    }

    // Add jurnal detail
    if (data.jurnalDetail) {
      formData.append("jurnal_detail", JSON.stringify(data.jurnalDetail.map((detail) => ({
        akun_perkiraan_detail_id: detail.akunPerkiraanDetailId,
        bukti: detail.bukti,
        debit: detail.debit,
        kredit: detail.kredit,
        urut: detail.urut,
        keterangan: detail.keterangan,
      }))));
    }

    const response = await axios.post(
      `http://127.0.0.1:5000/jurnal/${data.companyId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    const responseData = response.data;

    if (responseData.success === false) {
      throw new Error(responseData.message || "Create jurnal gagal");
    }

    return responseData.message;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors?.[0] || error.message);
    throw new Error(error.response?.data?.errors?.[0] || "Create jurnal gagal");
  }
};
