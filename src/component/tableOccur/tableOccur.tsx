import React, { useState } from "react";
import {
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Filter,
  ChevronRight,
} from "lucide-react";
import styles from "./styles.module.css";
import EditMenu from "../table/editMenu";
import { ObjekDetail } from "@/pages/(first-menu)/ObjekHukum/model/objekHukumModel";

interface Column<T> {
  key: keyof T;
  label: string;
  align?: "left" | "right" | "center";
}

type SubDataRow = Record<string, string>;

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onDelete: (item: T) => void;
  onEdit: (item: T) => void;
  isLoading?: boolean;
  observerRef?: React.RefObject<HTMLTableRowElement | null>;
  hideActions?: boolean;
}

const TableOccur = <T extends Record<string, any>>({
  columns,
  data = [],
  onDelete,
  onEdit,
  isLoading,
  observerRef,
  hideActions,
}: TableProps<T>) => {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Partial<Record<keyof T, string>>>({});
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const handleSort = (key: keyof T) => {
    setSortOrder(sortKey === key && sortOrder === "asc" ? "desc" : "asc");
    setSortKey(key);
  };

  const handleFilterChange = (key: keyof T, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const sortedData = Array.isArray(data)
    ? [...data].sort((a, b) => {
        if (!sortKey) return 0;
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (typeof valA === "number" && typeof valB === "number") {
          return sortOrder === "asc" ? valA - valB : valB - valA;
        }

        if (typeof valA === "string" && typeof valB === "string") {
          return sortOrder === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        return 0;
      })
    : [];

  const filteredData = sortedData.filter((item) =>
    columns.every(
      (col) =>
        !filters[col.key] ||
        (typeof item[col.key] === "string" &&
          item[col.key].toLowerCase().includes(filters[col.key]!.toLowerCase()))
    )
  );

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <colgroup>
          <col style={{ width: "40px" }} />
          {columns.map(() => (
            <col style={{ width: `${100 / columns.length}%` }} />
          ))}
          {!hideActions && <col style={{ width: "100px" }} />}{" "}
        </colgroup>

        <thead>
          <tr>
            <th className={`${styles.headerCell} ${styles.headerTable}`}></th>
            {columns.map((col) => (
              <th
                key={col.key as string}
                className={`${styles.headerCell} ${styles.headerTable}`}
              >
                <div className={styles.headerRow}>
                  <span className={styles.headerLabel}>{col.label}</span>
                  <div className={styles.actions}>
                    <button
                      className={styles.sortButton}
                      onClick={() => handleSort(col.key)}
                    >
                      {sortKey === col.key ? (
                        sortOrder === "asc" ? (
                          <ChevronUp size={16} color="white" />
                        ) : (
                          <ChevronDown size={16} color="white" />
                        )
                      ) : (
                        <ArrowUpDown size={16} color="white" />
                      )}
                    </button>
                  </div>
                </div>
              </th>
            ))}
            {!hideActions && (
              <th className={`${styles.headerCell} ${styles.headerTable}`}>
                Actions
              </th>
            )}
          </tr>
          <tr>
            <th className={styles.headerCell}></th>
            {columns.map((col) => (
              <th key={col.key as string} className={styles.headerCell}>
                <input
                  type="text"
                  value={filters[col.key] || ""}
                  onChange={(e) => handleFilterChange(col.key, e.target.value)}
                  className={styles.filterInputInline}
                />
              </th>
            ))}
            {!hideActions && <th className={styles.headerCell}></th>}
          </tr>
        </thead>

        <tbody>
          {filteredData.map((item, index) => {
            const isOpen = expandedRows.has(index);
            const hasSubData = item.detail && item.detail.length > 0;

            return (
              <React.Fragment key={index}>
                <tr>
                  {/* Kolom expandable icon */}
                  <td className={`${styles.cell} ${styles.smallCell}`}>
                    {hasSubData ? (
                      <button
                        onClick={() =>
                          setExpandedRows((prev) => {
                            const newSet = new Set(prev);
                            if (newSet.has(index)) {
                              newSet.delete(index);
                            } else {
                              newSet.add(index);
                            }
                            return newSet;
                          })
                        }
                        className={styles.expandButton}
                      >
                        {isOpen ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                    ) : null}
                  </td>

                  {/* Kolom data */}
                  {columns.map((col) => (
                    <td
                      key={col.key as string}
                      className={styles.cell}
                      style={{ textAlign: col.align || "left" }}
                    >
                      {col.key === "saldo"
                        ? `Rp ${Number(item[col.key]).toLocaleString()}`
                        : item[col.key]}
                    </td>
                  ))}

                  {/* Kolom actions */}
                  {!hideActions && !item["modify"] && (
                    <td className={styles.cellAction}>
                      <EditMenu
                        onDelete={() => onDelete(item)}
                        onEdit={() => onEdit(item)}
                      />
                    </td>
                  )}
                </tr>

                {isOpen && item.detail && (
                  <tr className={styles.expandedRow}>
                    <td colSpan={columns.length + (hideActions ? 1 : 2)}>
                      {item.detail.map((sub: ObjekDetail, i: number) => (
                        <div
                          className={styles.expandedRow}
                          key={i}
                          style={{ fontSize: "0.94rem", color: "#888" }}
                        >
                          • {sub.kodeObjek} - {sub.namaObjek}{" "}
                          {sub.deskripsiObjek}
                        </div>
                      ))}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}

          {/* Always render observer trigger row */}
          <tr ref={observerRef}>
            <td colSpan={columns.length + 2} style={{ height: "50px" }} />
          </tr>

          {isLoading && (
            <tr>
              <td colSpan={columns.length + 2} className={styles.loadingRow}>
                <div className={styles.loadingSpinner}></div>
                <span style={{ marginLeft: "8px" }}>Loading data...</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableOccur;
