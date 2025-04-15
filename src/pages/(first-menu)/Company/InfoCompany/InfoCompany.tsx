import { MenuItem, TextField, Typography } from "@mui/material";
import { Add, Refresh } from "@mui/icons-material";
import * as React from "react";
import styles from "./styles.module.css";
import SelectedTextField from "@/component/textField/selectedText";
import Table from "@/component/table/table";
import Button from "@/component/button/button";
import { fetchCompany } from "../function/fetchCompany";
import { CompanyModel } from "../model/companyModel";

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

const columns: Column<CompanyModel>[] = [
  { key: "nama", label: "Nama" },
  { key: "updatedBy", label: "Updated By" },
  { key: "updatedTime", label: "Updated Time" },
];

interface Column<T> {
  key: keyof T;
  label: string;
  align?: "left" | "right" | "center";
}

export default function InfoAkunPerkiraan() {
  const [selectedAcctType, setSelectedAcctType] = React.useState("");
  const [selectedStatusType, setStatusType] = React.useState("");
  const [selectedData, setSelectedData] = React.useState<CompanyModel | null>(
    null
  );
  const [tableData, setTableData] = React.useState<CompanyModel[]>([]);

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
        companyId: item.id,
        nama: item.nama,
        updatedTime: item.updatedAt,
        updatedBy: "-",
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

  const handleDelete = (item: CompanyModel) => {
    setSelectedData(item);
  };

  const handleEdit = (item: CompanyModel) => {
    setSelectedData(item);
    console.log("edit data ", selectedData);
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
    </>
  );
}
