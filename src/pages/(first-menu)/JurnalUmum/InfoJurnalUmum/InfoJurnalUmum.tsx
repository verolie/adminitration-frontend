import { MenuItem, TextField, Typography } from "@mui/material";
import { Add, Refresh } from "@mui/icons-material";
import * as React from "react";
import styles from "./styles.module.css";
import SelectedTextField from "@/component/textField/selectedText";
import Table from "@/component/table/table";
import Button from "@/component/button/button";
import PopupModal from "@/component/popupModal/popUpModal";
import { PopUpJurnalUmumContent } from "./popUpJurnalUmum/popUpJurnalUmumContent";
import { fetchJurnal } from "../function/fetchJurnalUmum";

interface Column<T> {
  key: keyof T;
  label: string;
  align?: "left" | "right" | "center";
}
interface DataRow {
  faktur: string;
  tgl: string;
  akun_perkiraan: string;
  total_debit: number;
  total_kredit: number;
}

const columns: Column<DataRow>[] = [
  { key: "faktur", label: "Faktur" },
  { key: "tgl", label: "Tanggal" },
  { key: "total_debit", label: "Debit", align: "right" },
  { key: "total_kredit", label: "Kredit", align: "right" },
];

export default function InfoJurnalUmum() {
  const [selectedData, setSelectedData] = React.useState<DataRow | null>(null);
  const [modalMode, setModalMode] = React.useState<"view" | "edit">("view");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [tableData, setTableData] = React.useState<DataRow[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const observerRef = React.useRef<HTMLTableRowElement | null>(null);
  const [loading, setLoading] = React.useState(false);
  const isFetching = React.useRef(false);

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

  React.useEffect(() => {
    fetchData(1);
  }, []);

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
          setPage((prev) => prev + 1); // Naikkan page hanya setelah sukses
        }
      }
    } catch (err) {
      console.error("Failed to fetch jurnal umum:", err);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  React.useEffect(() => {
    if (!hasMore || loading) return;

    console.log("Page:", page, "Has More:", hasMore, "Loading:", loading);

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isFetching.current) {
          fetchData(page);
          // setPage((prev) => prev + 1);
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
      setTimeout(() => {
        if (currentRef) observer.observe(currentRef);
      }, 0);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, loading, page]);

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
        {/* {hasMore && (
          <div
            ref={observerRef}
            style={{
              height: "60px",
              marginTop: "20px",
              background: "transparent",
            }}
          />
        )} */}
      </div>
    </>
  );
}

