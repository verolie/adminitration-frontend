import * as React from "react";
import styles from "./styles.module.css";
import { Typography } from "@mui/material";
import Table from "@/component/table/table";
import { fetchJurnalSmartax } from "../function/fetchJurnalSmartax";

interface InfoJurnalSmartaxProps {
  onEdit: (id: string) => void;
}

interface DataRow {
  id: string;
  tgl: string;
  lawan_transaksi: string;
  total_debit: number;
  total_kredit: number;
  deskripsi: string;
}

export default function InfoJurnalSmartax({ onEdit }: InfoJurnalSmartaxProps) {
  const [data, setData] = React.useState<DataRow[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [totalData, setTotalData] = React.useState(0);

  const columns = [
    { key: "tgl" as keyof DataRow, label: "Tanggal" },
    { key: "lawan_transaksi" as keyof DataRow, label: "Lawan Transaksi" },
    { key: "total_debit" as keyof DataRow, label: "Total Debit" },
    { key: "total_kredit" as keyof DataRow, label: "Total Kredit" },
    { key: "deskripsi" as keyof DataRow, label: "Deskripsi" },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyID");

      if (!token || !companyId) return;

      const result = await fetchJurnalSmartax(
        { companyId, page, limit },
        token
      );

      setData(result.data);
      setTotalData(result.total);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [page, limit]);

  const handleEdit = (item: DataRow) => {
    onEdit(item.id);
  };

  const handleDelete = (item: DataRow) => {
    // Implement delete functionality if needed
    console.log("Delete item:", item);
  };

  return (
    <div className={styles.container}>
      <Typography className={styles.titleText}>Info Jurnal Smartax</Typography>
      <Table
        columns={columns}
        data={data}
        isLoading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
} 