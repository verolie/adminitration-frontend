import React, { useEffect, useState, useCallback } from "react";
import Table from "@/component/table/table";
import Button from "@/component/button/button";
import { Add, Refresh } from "@mui/icons-material";
import { fetchLawanTransaksi, deleteLawanTransaksi } from "../lawanTransaksiApi";
import { LawanTransaksiModel } from "../lawanTransaksiModel";
import { Column } from "../../ObjekHukum/model/objekHukumModel";
import CreateLawanTransaksi from "../CreateLawanTransaksi/CreateLawanTransaksi";
import EditLawanTransaksi from "../EditLawanTransaksi/EditLawanTransaksi";
import styles from "./styles.module.css";

// Extend the LawanTransaksiModel to include action
interface LawanTransaksiWithAction extends LawanTransaksiModel {
  action?: string;
}

const columns: Column<LawanTransaksiWithAction>[] = [
  { key: "nama", label: "Nama" },
  { key: "npwp", label: "NPWP" },
  { key: "alamat", label: "Alamat" },
  { key: "is_badan_usaha", label: "Badan Usaha" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
];
interface InfoLawanTransaksiProps {
  companyId: string;
  onEdit?: (lawanTransaksiId: string) => void;
  onCreate?: () => void;
}


const InfoLawanTransaksi: React.FC<InfoLawanTransaksiProps> = ({ companyId: lawanTransaksiId, onEdit, onCreate }) => {
  const [data, setData] = useState<LawanTransaksiModel[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);


  // Fetch data function
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchLawanTransaksi(lawanTransaksiId, 1, page * 5);
      setData(result?.data || []);
      setHasMore(result?.data?.length === page * 5);
    } catch (err) {
      setHasMore(false);
    }
    setLoading(false);
  }, [lawanTransaksiId, page]);

  // Fetch data on mount and when page changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || loading) return;
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  // Handle delete
  const handleDelete = (item: Record<string, any>) => {
    deleteLawanTransaksi(lawanTransaksiId, item.id).then(() => {
      setData((prev) => prev.filter((d) => d.id !== item.id));
    });
  };

  // Handle edit
  const handleEdit = (item: Record<string, any>) => {
    if (onEdit) onEdit(String(item.id));
  };

  return (
    <>
      {/* Button Group */}
      <div className={styles.editFilterTable}>
        <div />
        <div className={styles.buttonGroup}>
        <Button
          size="small"
          variant="confirm"
          icon={<Add sx={{ color: "white" }} />}
          onClick={onCreate}
        />
          <Button
            size="small"
            variant="info"
            icon={<Refresh sx={{ color: "white" }} />}
            onClick={fetchData}
          />
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
      <Table<LawanTransaksiWithAction>
        columns={columns}
        data={data}
        onDelete={handleDelete}
        onEdit={handleEdit}
        isLoading={loading}
      />
        {!hasMore && (
          <div style={{ textAlign: "center", margin: 16, color: "#888" }}>
            Tidak ada data lagi
          </div>
        )}
      </div>
    </>
  );
};

export default InfoLawanTransaksi;

function onEdit(id: any) {
  throw new Error("Function not implemented.");
}
