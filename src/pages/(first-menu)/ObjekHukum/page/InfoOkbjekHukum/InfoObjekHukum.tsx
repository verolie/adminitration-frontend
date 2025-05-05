"use client";

import TableOccur from "@/component/tableOccur/tableOccur";
import { useEffect, useRef, useState } from "react";
import { Column, InfoSubObjek, SubObjek } from "../../model/objekHukumModel";
import styles from "./styles.module.css";
import { fetchObjekPajakDataMember } from "../../function/fetchObjekPajakDataMember";

const InfoObjekHukum = () => {
  const observerRef = useRef(null);
  const [data, setData] = useState<InfoSubObjek[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns: Column<InfoSubObjek>[] = [
    { key: "kodeAkun", label: "Kode Akun" },
    { key: "namaAkun", label: "Nama Akun" },
    { key: "keterangan", label: "keterangan" },
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
      const response = await fetchObjekPajakDataMember(
        { page: 1, limit: 20, companyId: companyID },
        token
      );
      setData(response);
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

  return (
    <div>
      <TableOccur
        columns={columns}
        data={data}
        onDelete={handleDelete}
        onEdit={handleEdit}
        observerRef={observerRef}
        isLoading={isLoading}
        hideActions
      />
    </div>
  );
};

export default InfoObjekHukum;
