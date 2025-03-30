import { MenuItem, TextField, Typography } from "@mui/material";
import { Add, Refresh } from "@mui/icons-material";
import * as React from "react";
import styles from "./styles.module.css";
import SelectedTextField from "@/component/textField/selectedText";
import Table from "@/component/table/table";
import Button from "@/component/button/button";
import PopupModal from "@/component/popupModal/popUpModal";
import { popUpInfoAcctContent } from "./popupInfoAcctContent/popUpInfoAcctContent";

const accountType = [
  { value: "test 1", label: "test 1" },
  { value: "test 2", label: "test 2" },
  { value: "test 3", label: "test 3" },
];

const statusType = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "inactive", label: "Inactive" },
];

interface DataRow {
  kodePerkiraan: string;
  nama: string;
  tipeAkun: string;
  saldo: string;
}

const data: DataRow[] = [
  { kodePerkiraan: "10", nama: "Kas", tipeAkun: "Asset", saldo: "5000000" },
  { kodePerkiraan: "1001", nama: "Kas", tipeAkun: "Asset", saldo: "5000000" },
  {
    kodePerkiraan: "1001312",
    nama: "Kas Cabang",
    tipeAkun: "Asset",
    saldo: "2000000",
  },
  {
    kodePerkiraan: "100131212",
    nama: "Bank Mandiri",
    tipeAkun: "Asset",
    saldo: "5000000",
  },
  { kodePerkiraan: "1002", nama: "Bank", tipeAkun: "Asset", saldo: "12000000" },
  {
    kodePerkiraan: "1002321",
    nama: "Bank Mandiri",
    tipeAkun: "Asset",
    saldo: "8000000",
  },
];

interface Column<T> {
  key: keyof T;
  label: string;
  align?: "left" | "right" | "center";
}

const columns: Column<DataRow>[] = [
  { key: "kodePerkiraan", label: "Kode Perkiraan" },
  { key: "nama", label: "Nama" },
  { key: "tipeAkun", label: "Tipe Akun" },
  { key: "saldo", label: "Saldo", align: "right" },
];

const formatKodePerkiraan = (kode: string, data: DataRow[]): string => {
  let parentKode = data
    .map((row) => row.kodePerkiraan)
    .filter((k) => k.length < kode.length && kode.startsWith(k))
    .sort((a, b) => b.length - a.length)[0];

  let indentLevel = parentKode ? parentKode.length / 2 + 1 : 0;
  let indentSpaces = " ".repeat(indentLevel * 2);

  return `${indentSpaces}${kode}`;
};

const formattedData = data.map((row) => ({
  ...row,
  kodePerkiraan: formatKodePerkiraan(row.kodePerkiraan, data),
  saldo: row.saldo.toLocaleString(),
}));

export default function InfoAkunPerkiraan() {
  const [selectedAcctType, setSelectedAcctType] = React.useState("");
  const [selectedStatusType, setStatusType] = React.useState("");
  const [selectedData, setSelectedData] = React.useState<DataRow | null>(null);
  const [modalMode, setModalMode] = React.useState<"view" | "edit">("view");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [tableData, setTableData] = React.useState<DataRow[]>(formattedData);

  const handleTambahData = () => {
    console.log("Tambah Data diklik");
    console.log("Tipe Akun:", selectedAcctType);
    console.log("Status:", selectedStatusType);
  };

  const handleDelete = (item: DataRow) => {
    setTableData((prevData) =>
      prevData.filter((row) => row.kodePerkiraan !== item.kodePerkiraan)
    );
  };

  const handleEdit = (item: DataRow) => {
    setSelectedData(item);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  return (
    <>
      <div className={styles.editFilterTable}>
        <div className={styles.filterTextField}>
          <SelectedTextField
            label="Tipe Akun"
            options={accountType}
            value={selectedAcctType}
            onChange={(e) => setSelectedAcctType(e.target.value)}
          />
          <SelectedTextField
            label="Status"
            options={statusType}
            value={selectedStatusType}
            onChange={(e) => setStatusType(e.target.value)}
          />
        </div>
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
      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          data={tableData}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      <PopupModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedData}
        mode={modalMode}
        renderContent={(data) => popUpInfoAcctContent(data, modalMode)}
      />
    </>
  );
}
