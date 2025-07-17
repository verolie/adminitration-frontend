import axios from "axios";
import { JurnalUmum } from "../model/JurnalUmumModel";
import { API_BASE_URL } from "@/utils/config";

export const editJurnalUmum = async (data: JurnalUmum, token: string) => {
  return await editData(data,  token);
};

const editData = async (data: JurnalUmum, token: string) => {
  try {
    const formData = new FormData();
    formData.append("id", data.id || "");
    formData.append("company_id", data.companyId || "");
    formData.append("faktur", data.faktur || "");
    formData.append("tgl", data.tgl || "");
    formData.append("total_debit", data.totalDebit?.toString() || "0");
    formData.append("total_kredit", data.totalKredit?.toString() || "0");
    formData.append("deskripsi", data.deskripsi || "");
    if (data.file) {
      formData.append("file", data.file);
    }
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

    const response = await axios.put(
      `${API_BASE_URL}/jurnal/${data.companyId}`,
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
      throw new Error(responseData.message || "Edit jurnal gagal");
    }

    return responseData.message;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors?.[0] || error.message);
    throw new Error(error.response?.data?.errors?.[0] || "Edit jurnal gagal");
  }
};
