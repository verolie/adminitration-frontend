import { MenuItem, TextField, Typography } from "@mui/material";
import { Add, Refresh } from "@mui/icons-material";
import * as React from "react";
import styles from "./styles.module.css";
import SelectedTextField from "@/component/textField/selectedText";
import Table from "@/component/table/table";
import Button from "@/component/button/button";
import PopupModal from "@/component/popupModal/popUpModal";
// import { popUpInfoAcctContent } from "./popupInfoAcctContent/popUpInfoAcctContent";
interface Column<T> {
  key: keyof T;
  label: string;
  align?: "left" | "right" | "center";
}
interface DataRow {
  faktur: string;
  tanggal: string;
  bukti: string;
  debit: number;
  kredit: number;
  kode_akun: string;
  nama_akun: string;
  company: string;
  jurnal: string;
  akun_perkiraan: string;
  total_debit: number;
  total_kredit: number;
}

const data: DataRow[] = [
  {
    faktur: "F001",
    tanggal: "2024-04-02",
    bukti: "INV001",
    debit: 500000,
    kredit: 0,
    kode_akun: "1001",
    nama_akun: "Kas",
    company: "Company A",
    jurnal: "Jurnal 1",
    akun_perkiraan: "Asset",
    total_debit: 500000,
    total_kredit: 0,
  },
  {
    faktur: "F002",
    tanggal: "2024-04-03",
    bukti: "INV002",
    debit: 0,
    kredit: 200000,
    kode_akun: "2001",
    nama_akun: "Bank",
    company: "Company B",
    jurnal: "Jurnal 2",
    akun_perkiraan: "Liability",
    total_debit: 0,
    total_kredit: 200000,
  },
];

const columns: Column<DataRow>[] = [
  { key: "faktur", label: "Faktur" },
  { key: "tanggal", label: "Tanggal" },
  { key: "bukti", label: "Bukti" },
  { key: "debit", label: "Debit", align: "right" },
  { key: "kredit", label: "Kredit", align: "right" },
  { key: "kode_akun", label: "Kode Akun" },
  { key: "nama_akun", label: "Nama Akun" },
  { key: "company", label: "Company" },
  { key: "jurnal", label: "Jurnal" },
  { key: "akun_perkiraan", label: "Akun Perkiraan" },
  { key: "total_debit", label: "Total Debit", align: "right" },
  { key: "total_kredit", label: "Total Kredit", align: "right" },
];

export default function InfoJurnalUmum() {
  const [selectedData, setSelectedData] = React.useState<DataRow | null>(null);
  const [modalMode, setModalMode] = React.useState<"view" | "edit">("view");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [tableData, setTableData] = React.useState<DataRow[]>(data);

  const handleDelete = (item: DataRow) => {
    setTableData((prevData) =>
      prevData.filter((row) => row.faktur !== item.faktur)
    );
  };

  const handleEdit = (item: DataRow) => {
    setSelectedData(item);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  return (
    <>
      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          data={tableData}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      {/* <PopupModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedData}
        mode={modalMode}
        renderContent={(data) => popUpInfoAcctContent(data, modalMode)} */}
      {/* /> */}
    </>
  );
}
