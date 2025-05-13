import { Typography } from "@mui/material";
import * as React from "react";
import styles from "./styles.module.css";
import Table from "@/component/table/table";
import Button from "@/component/button/button";
import PopupModal from "@/component/popupModal/popUpModal";
import { PopUpUserContent } from "./popUpUser/popUpUserContent";
import { fetchCompanyMember } from "../function/fetchCompanyMember";

interface Column<T> {
  key: keyof T;
  label: string;
  align?: "left" | "right" | "center";
}

interface DataRow {
  username: string;
  email: string;
  modified_by: string;
  modified_time: string;
}

const columns: Column<DataRow>[] = [
  { key: "username", label: "Username" },
  { key: "email", label: "Email" },
  { key: "modified_by", label: "Modified By" },
  { key: "modified_time", label: "Modified Time", align: "right" },
];

export default function InfoUser() {
  const [selectedData, setSelectedData] = React.useState<DataRow | null>(null);
  const [modalMode, setModalMode] = React.useState<"view" | "edit">("view");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [tableData, setTableData] = React.useState<DataRow[]>([]);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("companyID");

    try {
      if (token && companyId) {
        const result = await fetchCompanyMember(token, companyId);
        setTableData(result);
      }
    } catch (err) {
      console.error("Failed to fetch jurnal umum:", err);
    }
  };

  const handleDelete = (item: DataRow) => {
    setTableData((prevData) =>
      prevData.filter((row) => row.username !== item.username)
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

      <PopupModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedData}
        mode={modalMode}
        renderContent={(data) =>
          data ? <PopUpUserContent data={data} mode={modalMode} /> : null
        }
      />
    </>
  );
}
