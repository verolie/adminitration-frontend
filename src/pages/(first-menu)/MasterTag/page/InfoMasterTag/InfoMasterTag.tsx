"use client";

import TableOccur from "@/component/tableOccur/tableOccur";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import { fetchObjekPajakData } from "../../function/fetchObjekPajakDataMember";
import Button from "@/component/button/button";
import { Add, Refresh } from "@mui/icons-material";
import { useRouter } from "next/navigation"; // Import useRouter

interface InfoSubObjek {
  id: string;
  kodeObjek: string;
  namaObjek: string;
  deskripsiObjek: string;
  persentase: number;
  ObjekPajakDetails: ObjekPajakDetail[];
  kodeObjekPersentase?: string; // Tambahkan properti ini
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

const InfoMasterTag = () => {
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

      const transformedData: InfoSubObjek[] = response.map((item: any) => {
        const details = item.ObjekPajakDetails;
        console.log("item contoh ", item);
        // Ambil persentase dari tanggal terbaru, jika ada
        let latestPersentase = 0;
        if (details && details.length > 0) {
          const sortedDetails = [...details].sort(
            (a, b) => new Date(b.tgl).getTime() - new Date(a.tgl).getTime()
          );
          latestPersentase = sortedDetails[0].persentase;
        }

        return {
          id: item.id.toString(),
          kodeObjek: item.kodeObjek,
          namaObjek: item.namaObjek,
          deskripsiObjek: item.deskripsiObjek,
          persentase: latestPersentase + "%",
          kodeObjekPersentase: item.namaObjek ? `${item.kode_objek}` : "-",
        };
      });

      setData(transformedData);
    } catch (err) {
      console.error("Gagal fetch objek pajak:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: InfoSubObjek) => {
    console.log("Edit item:", item);
  };

  const handleDelete = (item: InfoSubObjek) => {
    setData((prev) => prev.filter((d) => d.id !== item.id));
  };

  const handleTambahData = () => {
    router.push("/master-data/master-tag/add"); // Arahkan ke halaman tambah data
  };

  return (
    <div>
      <div className={styles.editFilterTable}>
        <div className={styles.buttonGroup}>
          <Button
            size="small"
            variant="confirm"
            icon={<Add sx={{ color: "white" }} />}
            onClick={handleTambahData}
          />
          <Button
            size="small"
            variant="info"
            icon={<Refresh sx={{ color: "white" }} />}
            onClick={() => window.location.reload()}
          />
        </div>
      </div>
      <TableOccur
        columns={columns}
        data={data}
        onDelete={handleDelete}
        onEdit={handleEdit}
        observerRef={observerRef}
        isLoading={isLoading}
        // hideActions
      />
    </div>
  );
};

export default InfoMasterTag;
