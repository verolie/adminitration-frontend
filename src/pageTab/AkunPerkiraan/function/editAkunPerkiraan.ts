import axios from "axios";
import {
  AkunPerkiraanInduk,
  AkunPerkiraanSub,
  AkunPerkiraanDetail
} from "../model/AkunPerkiraanModel";
import { API_BASE_URL } from "@/utils/config";

// Fungsi utama yang digunakan di luar
export const editAkunPerkiraan = async (
  data: AkunPerkiraanInduk | AkunPerkiraanSub | AkunPerkiraanDetail,
  model: string,
  token: string
): Promise<string> => {
  switch (model) {
    case "induk":
      return await editDataInduk(data as AkunPerkiraanInduk, token);
    case "sub":
      console.log(data);
      return await editDataSub(data as AkunPerkiraanSub, token);
    case "detail":
      return await editDataDetail(data as AkunPerkiraanDetail, token);
    default:
      throw new Error("Model akun tidak valid");
  }
};

// Fungsi edit untuk model 'induk'
const editDataInduk = async (
  data: AkunPerkiraanInduk,
  token: string
): Promise<string> => {
  try {
    const requestData = {
      id: data.id,
      kode_akun: data.kodeAkun,
      nama_akun: data.namaAkun,
      keterangan: data.keterangan,
    };

    const response = await axios.put(
      `${API_BASE_URL}/akun-perkiraan/induk/${data.companyId}`,
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
      throw new Error(responseData.message || "Gagal edit akun induk");
    }

    return responseData.message;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors?.[0] || error.message);
    throw new Error(error.response?.data?.errors?.[0] || "Gagal edit akun induk");
  }
};

// Fungsi edit untuk model 'sub'
const editDataSub = async (
  data: AkunPerkiraanSub,
  token: string
): Promise<string> => {
  try {
    const requestData = {
      id: data.id,
      kode_akun: data.kodeAkun,
      nama_akun: data.namaAkun,
      keterangan: data.keterangan,
      akun_perkiraan_induk_id: data.akunPerkiraanIndukId
    };

    const response = await axios.put(
      `${API_BASE_URL}/akun-perkiraan/sub/${data.companyId}`,
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
      throw new Error(responseData.message || "Gagal edit akun sub");
    }

    return responseData.message;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors?.[0] || error.message);
    throw new Error(error.response?.data?.errors?.[0] || "Gagal edit akun sub");
  }
};

// Fungsi edit untuk model 'detail'
const editDataDetail = async (
  data: AkunPerkiraanDetail,
  token: string
): Promise<string> => {
  try {
    console.log("Data:", data);
    const requestData = {
      id: data.id,
      kode_akun: data.kodeAkun,
      nama_akun: data.namaAkun,
      keterangan: data.keterangan,
      akun_perkiraan_sub_id: data.akunPerkiraanSubId,
      saldo: data.saldo
    };

    const response = await axios.put(
      `${API_BASE_URL}/akun-perkiraan/detail/${data.companyId}`,
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
      throw new Error(responseData.message || "Gagal edit akun detail");
    }

    return responseData.message;
  } catch (error: any) {
    console.error("Error Response:", error.response?.data?.errors?.[0] || error.message);
    throw new Error(error.response?.data?.errors?.[0] || "Gagal edit akun detail");
  }
}; 