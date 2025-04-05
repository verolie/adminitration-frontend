import React, { useState } from "react";
import { ArrowUpDown, ChevronUp, ChevronDown, Filter } from "lucide-react";
import EditMenu from "./editMenu";
import styles from "./styles.module.css";

interface Column<T> {
  key: keyof T;
  label: string;
  align?: "left" | "right" | "center";
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onDelete: (item: T) => void;
  onEdit: (item: T) => void;
}

const Table = <T extends Record<string, any>>({
  columns,
  data,
  onDelete,
  onEdit,
}: TableProps<T>) => {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Partial<Record<keyof T, string>>>({});

  const handleSort = (key: keyof T) => {
    setSortOrder(sortKey === key && sortOrder === "asc" ? "desc" : "asc");
    setSortKey(key);
  };

  const handleFilterChange = (key: keyof T, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const sortedData = [...data].sort((a, b) => {
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
  });

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
          {columns.map((_, idx) => (
            <col key={idx} style={{ width: `${100 / columns.length}%` }} />
          ))}
          <col style={{ width: "100px" }} /> {/* Width untuk kolom "Actions" */}
        </colgroup>

        <thead>
          <tr>
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
            <th className={`${styles.headerCell} ${styles.headerTable}`}>
              Actions
            </th>
          </tr>
          <tr>
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
            <th className={styles.headerCell}></th>
          </tr>
        </thead>

        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
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
              {!item["modify"] && (
                <td className={styles.cellAction}>
                  <EditMenu
                    onDelete={() => onDelete(item)}
                    onEdit={() => onEdit(item)}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
