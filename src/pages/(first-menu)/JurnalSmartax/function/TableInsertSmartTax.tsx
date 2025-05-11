import React from "react";
import { TextField, IconButton, Select, MenuItem, FormControl } from "@mui/material";
import { Delete } from "@mui/icons-material";
import styles from "./styles.module.css";

interface LawanTransaksi {
  id: number;
  nama: string;
  npwp: string;
  nik: string | null;
  nitku: string | null;
  alamat: string;
  is_badan_usaha: boolean;
}

interface TableInsertSmartTaxProps {
  rows: {
    no: string;
    lawanTransaksi: string;
    bukti: string;
    debit: string;
    kredit: string;
    keterangan: string;
  }[];
  lawanTransaksiList: LawanTransaksi[];
  onChange: (index: number, field: string, value: string) => void;
  addRow: () => void;
  deleteRow: (index: number) => void;
}

const TableInsertSmartTax: React.FC<TableInsertSmartTaxProps> = ({
  rows,
  lawanTransaksiList,
  onChange,
  addRow,
  deleteRow,
}) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>No</th>
            <th>Lawan Transaksi</th>
            <th>Bukti</th>
            <th>Debit</th>
            <th>Kredit</th>
            <th>Keterangan</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <FormControl fullWidth size="small">
                  <Select
                    value={row.lawanTransaksi}
                    onChange={(e) => onChange(index, "lawanTransaksi", e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Pilih Lawan Transaksi
                    </MenuItem>
                    {lawanTransaksiList.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.nama}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </td>
              <td>
                <TextField
                  value={row.bukti}
                  onChange={(e) => onChange(index, "bukti", e.target.value)}
                  size="small"
                  fullWidth
                />
              </td>
              <td>
                <TextField
                  value={row.debit}
                  onChange={(e) => onChange(index, "debit", e.target.value)}
                  size="small"
                  type="number"
                  fullWidth
                />
              </td>
              <td>
                <TextField
                  value={row.kredit}
                  onChange={(e) => onChange(index, "kredit", e.target.value)}
                  size="small"
                  type="number"
                  fullWidth
                />
              </td>
              <td>
                <TextField
                  value={row.keterangan}
                  onChange={(e) => onChange(index, "keterangan", e.target.value)}
                  size="small"
                  fullWidth
                />
              </td>
              <td>
                <IconButton onClick={() => deleteRow(index)}>
                  <Delete />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow} className={styles.addButton}>
        Add Row
      </button>
    </div>
  );
};

export default TableInsertSmartTax;
