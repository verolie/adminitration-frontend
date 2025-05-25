import * as React from "react";
import styles from "./styles.module.css";
import { Typography } from "@mui/material";
import Table from "@/component/table/table";
import { fetchJurnalSmartax } from "../function/fetchJurnalSmartax";
import { deleteJurnalSmartax } from "../function/deleteJurnalSmartax";
import { useAlert } from "../../../../context/AlertContext";
import ModalConfirm from "@/component/confirmModalPopup/confirmModalPopup";

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
  lawan_transaksi_nama: string;
}

export default function InfoJurnalSmartax({ onEdit }: InfoJurnalSmartaxProps) {
  const [data, setData] = React.useState<DataRow[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [totalData, setTotalData] = React.useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<DataRow | null>(null);
  const { showAlert } = useAlert();

  const columns = [
    { key: "tgl" as keyof DataRow, label: "Tanggal" },
    { key: "lawan_transaksi_nama" as keyof DataRow, label: "Lawan Transaksi" },
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

      setData(result.data.map((row: any) => ({
        ...row,
        lawan_transaksi_nama: row.master_lawan_transaksi?.nama || '',
      })));
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

  const handleDelete = async (item: DataRow) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyID");
      if (!token || !companyId) return;
      await deleteJurnalSmartax(companyId, selectedItem.id, token);
      showAlert("Jurnal berhasil dihapus", "success");
      fetchData();
    } catch (error: any) {
      showAlert(error.message || "Gagal menghapus jurnal", "error");
    } finally {
      setDeleteModalOpen(false);
      setSelectedItem(null);
    }
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
      <ModalConfirm
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Jurnal"
        description="Apakah Anda yakin ingin menghapus jurnal ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        confirmColor="red"
      />
    </div>
  );
} 