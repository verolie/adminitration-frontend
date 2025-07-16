import * as React from "react";
import styles from "./styles.module.css";
import Table from "@/component/table/table";
import { fetchJurnal } from "../function/fetchJurnalUmum";
import { deleteJurnalUmum } from "../function/deleteJurnalUmum";
import ConfirmModalPopup from "@/component/confirmModalPopup/confirmModalPopup";

interface Column<T> {
  key: keyof T;
  label: string;
  align?: "left" | "right" | "center";
}

interface DataRow {
  id: string;
  faktur: string;
  tgl: string;
  akun_perkiraan: string;
  total_debit: number;
  total_kredit: number;
  is_smart_tax: boolean;
  deskripsi: string;
  lawan_transaksi_nama?: string;
}

const columns: Column<DataRow>[] = [
  { key: "faktur", label: "Faktur" },
  { key: "tgl", label: "Tanggal" },
  { key: "total_debit", label: "Debit", align: "right" },
  { key: "total_kredit", label: "Kredit", align: "right" },
  { key: "deskripsi", label: "Deskripsi" },
];

interface InfoJurnalUmumProps {
  onEdit: (id: string) => void;
  onSwitchToSmartax: (id: string) => void;
}

export default function InfoJurnalUmum({ onEdit, onSwitchToSmartax }: InfoJurnalUmumProps) {
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<DataRow | null>(null);

  const [tableData, setTableData] = React.useState<DataRow[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const observerRef = React.useRef<HTMLTableRowElement | null>(null);
  const [loading, setLoading] = React.useState(false);
  const isFetching = React.useRef(false);

  React.useEffect(() => {
    fetchData(1);
  }, []);

  React.useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isFetching.current) {
          fetchData(page);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0,
      }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, loading, page]);

  const fetchData = async (pageNum: number) => {
    if (isFetching.current) return;
    isFetching.current = true;
    setLoading(true);

    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("companyID");

    try {
      if (token && companyId) {
        const result = await fetchJurnal({ companyId, page: pageNum }, token);
        if (result.length === 0) {
          setHasMore(false);
        } else {
          setTableData((prev) => [...prev, ...result]);
          setPage((prev) => prev + 1);
        }
      }
    } catch (err) {
      console.error("Failed to fetch jurnal:", err);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  const handleDelete = (item: DataRow) => {
    setItemToDelete(item);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("companyID");

    if (!token || !companyId) {
      console.error("Missing token or company ID");
      return;
    }

    try {
      const dataToDelete = {
        id: itemToDelete.id,
        companyId: companyId,
      };

      await deleteJurnalUmum(dataToDelete, token);
      setTableData((prevData) =>
        prevData.filter((row) => row.faktur !== itemToDelete.faktur)
      );
    } catch (error) {
      console.error("Failed to delete item:", error);
    } finally {
      setIsConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const handleEdit = (item: DataRow) => {
    if (item.id) {
      if (item.is_smart_tax) {
        // Switch to Jurnal Smartax tab
        onSwitchToSmartax(item.id);
      } else {
        // Stay in Jurnal Umum tab and open edit form
      onEdit(item.id);
      }
    }
  };

  return (
    <>
      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          data={tableData}
          onDelete={handleDelete}
          onEdit={handleEdit}
          isLoading={loading}
          observerRef={observerRef}
        />

        {isConfirmOpen && (
          <ConfirmModalPopup
            open={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={confirmDelete}
            title="Hapus Jurnal"
            description={`Apakah kamu yakin ingin menghapus faktur ${itemToDelete?.faktur}?`}
            confirmLabel="Hapus"
            cancelLabel="Batal"
            confirmColor="red"
          />
        )}
      </div>
    </>
  );
}
