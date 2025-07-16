// src/pages/pageComponent/LawanTransaksi/InfoLawanTransaksi/lawanTransaksiApi.ts

import axios from "axios";
import { LawanTransaksiModel } from "./lawanTransaksiModel";

export const fetchLawanTransaksi = async (
  companyId: string,
  page = 1,
  limit = 5
): Promise<{ data: LawanTransaksiModel[] }> => {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    `http://127.0.0.1:5000/lawan-transaksi/${companyId}?limit=${limit}&page=${page}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const deleteLawanTransaksi = async (
  companyId: string,
  id: number
): Promise<void> => {
  const token = localStorage.getItem("token");
  await axios.post(
    `http://127.0.0.1:5000/lawan-transaksi/${companyId}/delete-one`,
    { id },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const createLawanTransaksi = async (companyId: string, data: any) => {
    const token = localStorage.getItem("token");
    await axios.post(`http://127.0.0.1:5000/lawan-transaksi/${companyId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
  export const updateLawanTransaksi = async (companyId: string, data: any) => {
    const token = localStorage.getItem("token");
    await axios.put(`http://127.0.0.1:5000/lawan-transaksi/${companyId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };