import { MenuItem, TextField, Typography } from "@mui/material";
import { Add, Refresh } from "@mui/icons-material";
import * as React from "react";
import styles from "./styles.module.css";
import SelectedTextField from "@/component/textField/selectedText";
import Table from "@/component/table/table";
import Button from "@/component/button/button";
import PopupModal from "@/component/popupModal/popUpModal";
import { popUpCompanyContent } from "./popUpCompany/popUpCompanyContent";
import { fetchCompany } from "../function/fetchCompany";

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
  nama: string;
  updatedTime: string;
  updatedBy: string;
}

// const data: DataRow[] = [
//   {
//     nama: "Kas",
//     updatedTime: "15-03-2024 10:25:30",
//     updatedBy: "Admin",
//   },
//   {
//     nama: "Kas Cabang",
//     updatedTime: "10-03-2024 14:12:45",
//     updatedBy: "User2",
//   },
//   {
//     nama: "Bank Mandiri",
//     updatedTime: "20-03-2024 08:50:15",
//     updatedBy: "User4",
//   },
//   {
//     nama: "Bank",
//     updatedTime: "03-05-2024 19:30:05",
//     updatedBy: "User6",
//   },
//   {
//     nama: "Bank BCA",
//     updatedTime: "25-03-2024 07:05:55",
//     updatedBy: "User8",
//   },
// ];

const columns: Column<DataRow>[] = [
  { key: "nama", label: "Nama" },
  { key: "updatedBy", label: "Updated By" },
  { key: "updatedTime", label: "Updated Time" },
];

interface Column<T> {
  key: keyof T;
  label: string;
  align?: "left" | "right" | "center";
}

// const formattedData = data.map((row) => ({
//   ...row,
// }));

export default function InfoAkunPerkiraan() {
  const [selectedAcctType, setSelectedAcctType] = React.useState("");
  const [selectedStatusType, setStatusType] = React.useState("");
  const [selectedData, setSelectedData] = React.useState<DataRow | null>(null);
  const [modalMode, setModalMode] = React.useState<"view" | "edit">("view");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [tableData, setTableData] = React.useState<DataRow[]>([]);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const result = await fetchCompany({}, token); // kalau perlu filter, bisa kirim object
      console.log("result get company ", result);
      const formatted = result?.map((item: any) => ({
        nama: item.nama,
        updatedTime: "-", // kalau belum ada data waktu
        updatedBy: "-", // kalau belum ada data user
      }));

      setTableData(formatted);
    } catch (err) {
      console.error("Gagal fetch company:", err);
    }
  };

  const handleTambahData = () => {
    console.log("Tambah Data diklik");
    console.log("Tipe Akun:", selectedAcctType);
    console.log("Status:", selectedStatusType);
  };

  const handleDelete = (item: DataRow) => {
    // setTableData((prevData) =>
    //   prevData.filter((row) => row.kodePerkiraan !== item.kodePerkiraan)
    // );
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
        renderContent={(data) => popUpCompanyContent(data, modalMode)}
      />
    </>
  );
}
