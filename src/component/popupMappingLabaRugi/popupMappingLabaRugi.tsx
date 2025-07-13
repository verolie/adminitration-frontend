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
import SelectionCheckbox from "../textField/selectionCheckbox";
import styles from "./styles.module.css";
import { bulkUpdateLaporanLabaRugi } from "../../pages/(first-menu)/MappingLabaRugi/function/bulkUpdate";
import { useAlert } from "@/context/AlertContext";

interface MappingRow {
  id: string;
  field1: string;
  operator: string;
  field2: (string | number)[];
}

interface PopupMappingLabaRugiProps {
  open: boolean;
  onClose: () => void;
  onSave: (mappings: MappingRow[]) => void;
  akunPerkiraanOptions: { value: string; label: string }[];
  initialMappings?: MappingRow[];
  accountCodeBeingEdited?: string; // New prop for the account code being edited
  laporanLabaRugiId?: number; // Add the ID for the laporan laba rugi row
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
  accountCodeBeingEdited = "",
  laporanLabaRugiId,
}: PopupMappingLabaRugiProps) {
  const [mappings, setMappings] = React.useState<MappingRow[]>([]);
  const [showAddRow, setShowAddRow] = React.useState(false); // State untuk kontrol visibilitas tombol Add New Row
  const { showAlert } = useAlert();

  React.useEffect(() => {
    if (open) {
      setMappings(initialMappings.length > 0 ? initialMappings : [createNewRow()]);
    }
  }, [open]);

  const createNewRow = (): MappingRow => ({
    id: Date.now().toString(),
    field1: accountCodeBeingEdited, // Set the account code being edited
    operator: "+",
    field2: [],
  });

  const handleAddRow = () => {
    setMappings([...mappings, createNewRow()]);
  };

  const handleDeleteRow = (id: string) => {
    if (mappings.length > 1) {
      setMappings(mappings.filter(row => row.id !== id));
    }
  };

  const handleRowChange = (id: string, field: keyof MappingRow, value: string | (string | number)[]) => {
    setMappings(mappings.map(row =>
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyID");
      
      if (!token || !companyId) {
        showAlert("Token atau Company ID tidak tersedia", "error");
        return;
      }

      if (!laporanLabaRugiId) {
        showAlert("ID Laporan Laba Rugi tidak tersedia", "error");
        return;
      }

      // Validate that at least one mapping has selected accounts
      const validMappings = mappings.filter(mapping => mapping.field2.length > 0);
      if (validMappings.length === 0) {
        showAlert("Pilih minimal satu akun perkiraan", "error");
        return;
      }

      // Format data sesuai dengan API yang diharapkan
      const bulkData = validMappings.map(mapping => ({
        laporan_laba_rugi_id: laporanLabaRugiId,
        akun_perkiraan_detail_ids: mapping.field2.map(id => parseInt(id.toString())),
      }));

      console.log("Sending mapping data:", bulkData);
      await bulkUpdateLaporanLabaRugi(bulkData, token, companyId);

      showAlert("Mapping berhasil disimpan", "success");
      onSave(mappings);
      onClose();
    } catch (error) {
      console.error("Error saving mapping:", error);
      showAlert("Gagal menyimpan mapping", "error");
    }
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
                <Typography className={styles.fieldLabel}>Kode Akun Laporan</Typography>
                <SelectedTextField
                  label="Kode Akun Laporan"
                  options={[{ value: accountCodeBeingEdited, label: accountCodeBeingEdited }]}
                  value={row.field1}
                  onChange={(e) => handleRowChange(row.id, "field1", e.target.value)}
                  sx={{ width: "100%" }}
                  readOnly={true}
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
                <Typography className={styles.fieldLabel}>Akun Perkiraan</Typography>
                <SelectionCheckbox
                  label="Pilih Akun Perkiraan"
                  options={akunPerkiraanOptions}
                  value={row.field2}
                  onChange={(value) => handleRowChange(row.id, "field2", value)}
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
          {/* <Button
            size="large"
            variant="info"
            label="Add New Row"
            onClick={handleAddRow}
          /> */}
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