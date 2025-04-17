import { MenuItem, TextField, Typography } from "@mui/material";
import { Add, Refresh } from "@mui/icons-material";
import * as React from "react";
import styles from "./styles.module.css";
import SelectedTextField from "@/component/textField/selectedText";
import Table from "@/component/table/table";
import Button from "@/component/button/button";
import { fetchAkunPerkiraanDetail } from "../../function/fetchAkunPerkiraanDetail";

const accountType = [
  { id: 1, name: "Asset" },
  { id: 2, name: "Utang" },
  { id: 3, name: "Modal" },
  { id: 4, name: "Pendapatan" },
  { id: 5, name: "Beban" },
];

const statusType = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "inactive", label: "Inactive" },
];

interface DataRow {
  id: string;
  kodePerkiraan: string;
  nama: string;
  tipeAkun: string;
  saldo: string;
}

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

function formatKodePerkiraan(kode: string, allData: DataRow[]): string {
  const level = kode.split(".").length - 1;
  const target = allData.find((item) => item.kodePerkiraan === kode);

  if (!target) return kode;

  const indent = "  ".repeat(level);
  return `${indent}${target.kodePerkiraan}`;
}

interface InfoAkunPerkiraanProps {
  onEdit: (id: string) => void;
}

export default function InfoAkunPerkiraan({ onEdit }: InfoAkunPerkiraanProps) {
  const [selectedAcctType, setSelectedAcctType] = React.useState<number | "">(
    ""
  );
  const [selectedStatusType, setStatusType] = React.useState("");
  const [tableData, setTableData] = React.useState<DataRow[]>([]);

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
    console.log(item);
    if (item.id) {
      onEdit(item.id);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("companyID");

    if (!token || !companyId) {
      console.error("Token atau Company ID tidak tersedia.");
      return;
    }

    try {
      const rawData = await fetchAkunPerkiraanDetail({ companyId }, token);

      console.log("row data", rawData);
      const mappedData: DataRow[] = rawData.map((item: any) => ({
        id: item.id,
        kodePerkiraan: item.kode_akun,
        nama: item.nama_akun,
        tipeAkun: item.tipe_akun,
        saldo: item.saldo,
      }));

      const formatted = mappedData.map((row) => ({
        ...row,
        kodePerkiraan: formatKodePerkiraan(row.kodePerkiraan, mappedData),
      }));

      setTableData(formatted);
    } catch (error) {
      console.error("Gagal ambil data akun perkiraan", error);
    }
  };

  return (
    <>
      <div className={styles.editFilterTable}>
        <div className={styles.filterTextField}>
          <SelectedTextField
            label="Tipe Akun"
            value={selectedAcctType}
            onChange={(e) => setSelectedAcctType(Number(e.target.value))}
            options={accountType.map((type) => ({
              value: type.id,
              label: type.name,
            }))}
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
    </>
  );
}
