import axios from "axios";
import { JurnalUmum } from "../model/JurnalUmumModel";

export const editJurnalUmum = async (data: JurnalUmum, token: string) => {
  return await editData(data,  token);
};

const editData = async (data: JurnalUmum, token: string) => {
  try {
    const requestData = {
      id : data.id,
      company_id: data.companyId, // sesuai field dari backend
      faktur: data.faktur,
      tgl: data.tgl,
      total_debit: data.totalDebit,
      total_kredit: data.totalKredit,
      jurnal_detail: data.jurnalDetail?.map((detail) => ({
        akun_perkiraan_detail_id: detail.akunPerkiraanDetailId,
        bukti: detail.bukti,
        debit: detail.debit,
        kredit: detail.kredit,
        urut: detail.urut,
        keterangan: detail.keterangan,
      }))
    };

    const response = await axios.put(
      `http://127.0.0.1:5000/jurnal/${data.companyId}`, // Ganti sesuai endpoint kamu
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    const responseData = response.data;

    console.log("Response data:", responseData.data);

    if (responseData.success === false) {
      throw new Error(responseData.message || "Create jurnal gagal");
    }

    return responseData.message;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors?.[0] || error.message);
    throw new Error(error.response?.data?.errors?.[0] || "Create jurnal gagal");
  }
};
