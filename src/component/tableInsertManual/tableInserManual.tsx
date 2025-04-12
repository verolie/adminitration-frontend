import React from "react";
import { TextField, IconButton, MenuItem } from "@mui/material";
import { Delete } from "@mui/icons-material";
import styles from "./styles.module.css";
import FieldText from "@/component/textField/fieldText";
import SelectedTextField from "@/component/textField/selectedText";
import DatePickerField from "@/component/textField/dateAreaText";
import AreaText from "@/component/textField/areaText";

type FieldType = "text" | "select" | "date" | "area";

interface Column<T> {
  field: keyof T;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[]; // buat select
}

interface TableInsertManualProps<T extends object> {
  rows: T[];
  onChange: (index: number, field: keyof T, value: string) => void;
  addRow: () => void;
  deleteRow: (index: number) => void;
  columns: Column<T>[];
}

const TableInsertManual = <T extends object>({
  rows,
  onChange,
  addRow,
  deleteRow,
  columns,
}: TableInsertManualProps<T>) => {
  return (
    <div className={styles.tableContainer}>
      {/* Header Row */}
      <div className={styles.headerRow}>
        <div className={styles.noColumn}>No</div>
        {columns.map((col, i) => (
          <div key={i} className={styles.headerCell}>
            {col.label}
          </div>
        ))}
        <div className={styles.aksiColumn}>Aksi</div>
      </div>

      {/* Data Rows */}
      {rows.map((row, index) => (
        <div key={index} className={styles.dataRow}>
          <div className={styles.noColumnContent}>{index + 1}</div>
          {columns.map((col, colIndex) => {
            const value = row[col.field] as string;
            const handleChange = (
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => onChange(index, col.field, e.target.value);

            switch (col.type) {
              case "text":
                return (
                  <FieldText
                    key={colIndex}
                    label={col.label}
                    value={value}
                    onChange={handleChange}
                    sx={{ width: "100%" }}
                  />
                );
              case "select":
                return (
                  <SelectedTextField
                    key={colIndex}
                    label={col.label}
                    options={col.options || []}
                    value={value}
                    onChange={(e) => onChange(index, col.field, e.target.value)}
                    sx={{ width: "100%" }}
                  />
                );
              case "date":
                return (
                  <DatePickerField
                    key={colIndex}
                    value={value}
                    onChange={(e) => onChange(index, col.field, e.target.value)}
                    sx={{ width: "100%" }}
                  />
                );
              case "area":
                return (
                  <AreaText
                    key={colIndex}
                    label={col.label}
                    value={value}
                    onChange={handleChange}
                    sx={{ width: "100%" }}
                  />
                );
              default:
                return null;
            }
          })}
          <div className={styles.aksiColumnContent}>
            <IconButton onClick={() => deleteRow(index)}>
              <Delete />
            </IconButton>
          </div>
        </div>
      ))}

      <div className={styles.addRowButton}>
        <button type="button" onClick={addRow}>
          + Tambah Baris
        </button>
      </div>
    </div>
  );
};

export default TableInsertManual;
