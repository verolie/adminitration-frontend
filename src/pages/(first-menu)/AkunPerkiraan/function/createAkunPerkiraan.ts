import axios from "axios";
import {
  AkunPerkiraanInduk,
  AkunPerkiraanSub,
  AkunPerkiraanDetail
} from "../model/AkunPerkiraanModel";

// Fungsi utama yang digunakan di luar
export const createAkunPerkiraan = async (
  data: AkunPerkiraanInduk | AkunPerkiraanSub | AkunPerkiraanDetail,
  model: string,
  token: string
): Promise<string> => {
  switch (model) {
    case "induk":
      return await createDataInduk(data as AkunPerkiraanInduk, token);
    case "sub":
      return await createDataSub(data as AkunPerkiraanSub, token);
    case "detail":
      return await createDataDetail(data as AkunPerkiraanDetail, token);
    default:
      throw new Error("Model akun tidak valid");
  }
};

// Fungsi create untuk model 'induk'
const createDataInduk = async (
  data: AkunPerkiraanInduk,
  token: string
): Promise<string> => {
  try {
    const requestData = {
      kode_akun: data.kodeAkun,
      nama_akun: data.namaAkun,
      keterangan: data.keterangan,
      tipe_akun_id: data.tipeAkunId,
    };

    const response = await axios.post(
      `http://127.0.0.1:5000/akun-perkiraan/induk/${data.companyId}`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    const responseData = response.data;

    if (!responseData.success) {
      throw new Error(responseData.message || "Gagal create akun induk");
    }

    return responseData.message;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors?.[0] || error.message);
    throw new Error(error.response?.data?.errors?.[0] || "Gagal create akun induk");
  }
};

// Fungsi create untuk model 'sub'
const createDataSub = async (
  data: AkunPerkiraanSub,
  token: string
): Promise<string> => {
  try {
    const requestData = {
      kode_akun: data.kodeAkun,
      nama_akun: data.namaAkun,
      keterangan: data.keterangan,
      akun_perkiraan_induk_id: data.akunPerkiraanIndukId
    };

    const response = await axios.post(
      `http://127.0.0.1:5000/akun-perkiraan/sub/${data.companyId}`,
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

    if (!responseData.success) {
      throw new Error(responseData.message || "Gagal create akun sub");
    }

    return responseData.message;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors?.[0] || error.message);
    throw new Error(error.response?.data?.errors?.[0] || "Gagal create akun sub");
  }
};

// Fungsi create untuk model 'detail'
const createDataDetail = async (
  data: AkunPerkiraanDetail,
  token: string
): Promise<string> => {
  try {
    console.log("Data:", data);
    const requestData = {
      kode_akun: data.kodeAkun,
      nama_akun: data.namaAkun,
      keterangan: data.keterangan,
      akun_perkiraan_sub_id: data.akunPerkiraanSubId,
      saldo: data.saldo
    };

    const response = await axios.post(
      `http://127.0.0.1:5000/akun-perkiraan/detail/${data.companyId}`,
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

    if (!responseData.success) {
      throw new Error(responseData.message || "Gagal create akun detail");
    }

    return responseData.message;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors?.[0] || error.message);
    throw new Error(error.response?.data?.errors?.[0] || "Gagal create akun detail");
  }
};
