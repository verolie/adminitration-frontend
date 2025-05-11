"use client";

import TableOccur from "@/component/tableOccur/tableOccur";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import { fetchObjekPajakData } from "../../function/fetchObjekPajakDataMember";
import Button from "@/component/button/button";
import { Add, Refresh } from "@mui/icons-material";
import { useRouter } from "next/navigation"; // Import useRouter
import AccordionTableMasterTax from "@/pages/(first-menu)/MasterTax/function/accordionTableMasterTax"; // Adjust the import path as needed
import { AkunPerkiraanDetail as ImportedAkunPerkiraanDetail } from "@/pages/(first-menu)/AkunPerkiraan/model/AkunPerkiraanModel";

interface AkunPerkiraanDetail {
  kode_akun: string;
  nama_akun: string;
}

interface InfoSubObjek {
  id: number;
  kodeObjek: string;
  namaObjek: string;
  deskripsiObjek: string;
  persentase: number;
  ObjekPajakDetails: ObjekPajakDetail[];
  akunPerkiraanDetails: AkunPerkiraanDetail[];
  kodeObjekPersentase?: string;
}

interface ObjekPajakDetail {
  id: number;
  tgl: string;
  is_badan_usaha: boolean;
  persentase: number;
}

interface Column<T> {
  key: keyof T;
  label: string;
}

const InfoMasterTax = () => {
  const observerRef = useRef(null);
  const [data, setData] = useState<InfoSubObjek[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // Inisialisasi useRouter

  // Modifikasi kolom untuk menampilkan "Kode Objek"
  const columns: Column<InfoSubObjek>[] = [
    { key: "kodeObjek", label: "Kode Objek" },
    { key: "namaObjek", label: "Nama Objek" },
    { key: "deskripsiObjek", label: "Deskripsi Objek" },
    { key: "persentase", label: "Persentase" }, // Tambahan kolom persentase
  ];

  const token = localStorage.getItem("token");
  const companyID = localStorage.getItem("companyID");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!token || !companyID) {
      console.warn("Token tidak ditemukan.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetchObjekPajakData(
        { page: 1, limit: 100, companyId: companyID },
        token
      );
      console.log("response ", response);

      const transformedData: InfoSubObjek[] = response.map((item: any) => {
        const details = item.ObjekPajakDetails || []; // Ensure this is an array
        let latestPersentase = 0;
        if (details.length > 0) {
          const sortedDetails = [...details].sort(
            (a, b) => new Date(b.tgl).getTime() - new Date(a.tgl).getTime()
          );
          latestPersentase = sortedDetails[0].persentase;
        }

        console.log(item.akunPerkiraanDetails);

        return {
          id: parseInt(item.id),
          kodeObjek: item.kodeObjek,
          namaObjek: item.namaObjek,
          deskripsiObjek: item.deskripsiObjek,
          persentase: latestPersentase,
          ObjekPajakDetails: details,
          kodeObjekPersentase: item.namaObjek ? `${item.kodeObjek}` : "-",
          akunPerkiraanDetails: item.akunPerkiraanDetails?.map((akun: ImportedAkunPerkiraanDetail) => ({
            kode_akun: akun.kode_akun || '',
            nama_akun: akun.nama_akun || ''
          })) || [],
          isBadanUsaha: item.isBadanUsaha,
        };
      });

      setData(transformedData);
    } catch (err) {
      console.error("Gagal fetch objek pajak:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.editFilterTable}>
        <Button
          size="small"
          variant="info"
          icon={<Refresh sx={{ color: "white" }} />}
          onClick={() => fetchData()}
        />
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.scrollableContainer}>
          <AccordionTableMasterTax data={data} />
        </div>
      )}
    </div>
  );
};

export default InfoMasterTax;
