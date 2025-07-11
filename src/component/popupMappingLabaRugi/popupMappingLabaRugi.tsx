import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Close, Add, Delete } from "@mui/icons-material";
import Button from "../button/button";
import SelectedTextField from "../textField/selectedText";
import styles from "./styles.module.css";

interface MappingRow {
  id: string;
  field1: string;
  operator: string;
  field2: string;
}

interface PopupMappingLabaRugiProps {
  open: boolean;
  onClose: () => void;
  onSave: (mappings: MappingRow[]) => void;
  akunPerkiraanOptions: { value: string; label: string }[];
  initialMappings?: MappingRow[];
}

const operatorOptions = [
  { value: "+", label: "+" },
  { value: "-", label: "-" },
  { value: "×", label: "×" },
  { value: "÷", label: "÷" },
];

export default function PopupMappingLabaRugi({
  open,
  onClose,
  onSave,
  akunPerkiraanOptions,
  initialMappings = [],
}: PopupMappingLabaRugiProps) {
  const [mappings, setMappings] = React.useState<MappingRow[]>([]);
  const [showAddRow, setShowAddRow] = React.useState(false); // State untuk kontrol visibilitas tombol Add New Row

  React.useEffect(() => {
    if (open) {
      setMappings(initialMappings.length > 0 ? initialMappings : [createNewRow()]);
    }
  }, [open]);

  const createNewRow = (): MappingRow => ({
    id: Date.now().toString(),
    field1: "",
    operator: "+",
    field2: "",
  });

  const handleAddRow = () => {
    setMappings([...mappings, createNewRow()]);
  };

  const handleDeleteRow = (id: string) => {
    if (mappings.length > 1) {
      setMappings(mappings.filter(row => row.id !== id));
    }
  };

  const handleRowChange = (id: string, field: keyof MappingRow, value: string) => {
    setMappings(mappings.map(row =>
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const handleSave = () => {
    onSave(mappings);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: { maxHeight: "80vh" },
      }}
    >
      <DialogTitle className={styles.dialogTitle}>
        <Typography variant="h6">Mapping Laba Rugi</Typography>
        <IconButton onClick={onClose} className={styles.closeButton}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent className={styles.dialogContent}>
        <div className={styles.mappingContainer}>
          {mappings.map((row, index) => (
            <div key={row.id} className={styles.mappingRow}>
              <div className={styles.rowNumber}>{index + 1}</div>
              
              <div className={styles.fieldContainer}>
                <Typography className={styles.fieldLabel}>Field 1</Typography>
                <SelectedTextField
                  label="Pilih Akun Perkiraan"
                  options={akunPerkiraanOptions}
                  value={row.field1}
                  onChange={(e) => handleRowChange(row.id, "field1", e.target.value)}
                  sx={{ width: "100%" }}
                />
              </div>

              <div className={styles.operatorContainer}>
                <Typography className={styles.fieldLabel}>Operator</Typography>
                <SelectedTextField
                  label="Operator"
                  options={operatorOptions}
                  value={row.operator}
                  onChange={(e) => handleRowChange(row.id, "operator", e.target.value)}
                  sx={{ width: "100%" }}
                />
              </div>

              <div className={styles.fieldContainer}>
                <Typography className={styles.fieldLabel}>Field 2</Typography>
                <SelectedTextField
                  label="Pilih Akun Perkiraan"
                  options={akunPerkiraanOptions}
                  value={row.field2}
                  onChange={(e) => handleRowChange(row.id, "field2", e.target.value)}
                  sx={{ width: "100%" }}
                />
              </div>

              <div className={styles.actionContainer}>
                <IconButton
                  onClick={() => handleDeleteRow(row.id)}
                  disabled={mappings.length === 1}
                  className={styles.deleteButton}
                >
                  <Delete />
                </IconButton>
              </div>
            </div>
          ))}
          {/* Hapus tombol Add New Row dari sini */}
        </div>
      </DialogContent>

      <DialogActions className={styles.dialogActionsSplit}>
        <div className={styles.dialogActionsLeft}>
          <Button
            size="large"
            variant="info"
            label="Add New Row"
            onClick={handleAddRow}
          />
        </div>
        <div className={styles.dialogActionsRight}>
                  <Button
            size="large"
            variant="alert"
            label="Cancel"
            onClick={onClose}
          />
          <Button
            size="large"
            variant="confirm"
            label="Save"
            onClick={handleSave}
          />
        </div>
      </DialogActions>
    </Dialog>
  );
} 