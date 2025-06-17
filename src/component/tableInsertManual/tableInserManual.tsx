import React from "react";
import { TextField, IconButton, MenuItem } from "@mui/material";
import { Delete } from "@mui/icons-material";
import styles from "./styles.module.css";
import FieldText from "@/component/textField/fieldText";
import SelectedTextField from "@/component/textField/selectedText";
import DatePickerField from "@/component/textField/dateAreaText";
import AreaText from "@/component/textField/areaText";
import Button from "../button/button";

type FieldType = "text" | "select" | "date" | "area";

interface Column<T> {
  field: keyof T;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
}

interface TableInsertManualProps<T extends object> {
  rows: T[];
  onChange: (index: number, field: keyof T, value: string) => void;
  addRow: () => void;
  deleteRow: (index: number) => void;
  columns: Column<T>[];
  showAddButton?: boolean;
}

const TableInsertManual = <T extends object>({
  rows,
  onChange,
  addRow,
  deleteRow,
  columns,
  showAddButton = true,
}: TableInsertManualProps<T>) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>No</th>
            {columns.map((col, i) => (
              <th key={i}>{col.label}</th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              {columns.map((col, colIndex) => {
                const value = row[col.field] as string;
                const handleChange = (
                  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => onChange(index, col.field, e.target.value);

                switch (col.type) {
                  case "text":
                    return (
                      <td key={colIndex}>
                        <TextField
                          value={value}
                          onChange={handleChange}
                          onBlur={(e) => onChange(index, col.field, require("@/utils/formatNumber").formatRupiah(e.target.value))}
                          size="small"
                          fullWidth
                        />
                      </td>
                    );
                  case "select":
                    return (
                      <td key={colIndex}>
                        <SelectedTextField
                          label={col.label}
                          options={col.options || []}
                          value={value}
                          onChange={(e) => onChange(index, col.field, e.target.value)}
                          sx={{ width: "100%" }}
                        />
                      </td>
                    );
                  case "date":
                    return (
                      <td key={colIndex}>
                        <DatePickerField
                          value={value}
                          onChange={(e) => onChange(index, col.field, e.target.value)}
                          sx={{ width: "100%" }}
                        />
                      </td>
                    );
                  case "area":
                    return (
                      <td key={colIndex}>
                        <AreaText
                          label={col.label}
                          value={value}
                          onChange={handleChange}
                          sx={{ width: "100%" }}
                        />
                      </td>
                    );
                  default:
                    return null;
                }
              })}
              <td>
                {!(row as any).isSmartTax && (
                  <IconButton onClick={() => deleteRow(index)}>
                    <Delete />
                  </IconButton>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAddButton && (
        <button onClick={addRow} className={styles.addButton}>
          Add Row
        </button>
      )}
    </div>
  );
};

export default TableInsertManual;
