import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
  Grid,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { Close, Add, Delete, Search } from "@mui/icons-material";
import Button from "../button/button";
import SelectedTextField from "../textField/selectedText";
import SelectionCheckbox from "../textField/selectionCheckbox";
import styles from "./styles.module.css";
import { bulkUpdateLaporanNeraca } from "../../pageTab/MappingLaporanNeraca/function/bulkUpdate";
import { useAlert } from "@/context/AlertContext";

interface MappingRow {
  id: string;
  field1: string;
  operator: string;
  field2: (string | number)[];
}

interface PopupMappingNeracaProps {
  open: boolean;
  onClose: () => void;
  onSave: (mappings: MappingRow[]) => void;
  akunPerkiraanOptions: { value: string; label: string }[];
  initialMappings?: MappingRow[];
  accountCodeBeingEdited?: string; // New prop for the account code being edited
  laporanNeracaId?: number; // Add the ID for the laporan neraca row
  initialSelectedAccounts?: (string | number)[]; // New prop for pre-selected accounts
}

const operatorOptions = [
  { value: "+", label: "+" },
  { value: "-", label: "-" },
];

export default function PopupMappingNeraca({
  open,
  onClose,
  onSave,
  akunPerkiraanOptions,
  initialMappings = [],
  accountCodeBeingEdited = "",
  laporanNeracaId,
  initialSelectedAccounts = [],
}: PopupMappingNeracaProps) {
  const [mappings, setMappings] = React.useState<MappingRow[]>([]);
  const [selectedAccounts, setSelectedAccounts] = React.useState<(string | number)[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const { showAlert } = useAlert();

  React.useEffect(() => {
    if (open) {
      setMappings(initialMappings.length > 0 ? initialMappings : [createNewRow()]);
      // Initialize selected accounts from initial mappings or from initialSelectedAccounts prop
      const initialSelected = initialMappings.length > 0 
        ? initialMappings[0].field2 
        : initialSelectedAccounts;
      setSelectedAccounts(initialSelected);
      setSearchTerm(""); // Reset search when opening
    }
  }, [open, initialSelectedAccounts]);

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

  const handleAccountSelection = (accountValue: string | number, checked: boolean) => {
    if (checked) {
      setSelectedAccounts([...selectedAccounts, accountValue]);
    } else {
      setSelectedAccounts(selectedAccounts.filter(acc => acc !== accountValue));
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter accounts based on search term
  const filteredAccounts = akunPerkiraanOptions.filter(account =>
    account.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyID");
      
      if (!token || !companyId) {
        showAlert("Token atau Company ID tidak tersedia", "error");
        return;
      }

      if (!laporanNeracaId) {
        showAlert("ID Laporan Neraca tidak tersedia", "error");
        return;
      }

      // Validate that at least one account is selected
      if (selectedAccounts.length === 0) {
        showAlert("Pilih minimal satu akun perkiraan", "error");
        return;
      }

      // Update mappings with selected accounts
      const updatedMappings = mappings.map(mapping => ({
        ...mapping,
        field2: selectedAccounts
      }));

      // Format data sesuai dengan API yang diharapkan
      const bulkData = updatedMappings.map(mapping => ({
        laporan_neraca_id: laporanNeracaId,
        akun_perkiraan_detail_ids: mapping.field2.map(id => parseInt(id.toString())),
      }));

      console.log("Sending mapping data:", bulkData);
      await bulkUpdateLaporanNeraca(bulkData, token, companyId);

      showAlert("Mapping berhasil disimpan", "success");
      onSave(updatedMappings);
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
        <Typography variant="h6">Mapping Neraca</Typography>
        <IconButton onClick={onClose} className={styles.closeButton}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent className={styles.dialogContent}>
        {/* Top Section: Mapping Neraca */}
        <div className={styles.mappingContainer}>
          <Typography variant="h6" className={styles.sectionTitle}>
            Mapping Neraca
          </Typography>
          {mappings.map((row, index) => (
            <div key={row.id} className={styles.mappingRow}>
              {/* <div className={styles.rowNumber}>{index + 1}</div> */}
              
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

              {/* <div className={styles.operatorContainer}>
                <Typography className={styles.fieldLabel}>Operator</Typography>
                <SelectedTextField
                  label="Operator"
                  options={operatorOptions}
                  value={row.operator}
                  onChange={(e) => handleRowChange(row.id, "operator", e.target.value)}
                  sx={{ width: "100%" }}
                />
              </div> */}

              {/* <div className={styles.actionContainer}>
                <IconButton
                  onClick={() => handleDeleteRow(row.id)}
                  disabled={mappings.length === 1}
                  className={styles.deleteButton}
                >
                  <Delete />
                </IconButton>
              </div> */}
            </div>
          ))}
        </div>

        {/* Bottom Section: Checklist Akun Perkiraan */}
        <div className={styles.checklistContainer}>
          <Typography variant="h6" className={styles.sectionTitle}>
            Pilih Akun Perkiraan
          </Typography>
          
          {/* Search Field */}
          <div className={styles.searchContainer}>
            <TextField
              fullWidth
              placeholder="Cari akun perkiraan..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <Search className={styles.searchIcon} />,
              }}
              className={styles.searchField}
            />
          </div>

          <div className={styles.checklistGrid}>
            {filteredAccounts.map((account) => (
              <FormControlLabel
                key={account.value}
                control={
                  <Checkbox
                    checked={selectedAccounts.includes(account.value)}
                    onChange={(e) => handleAccountSelection(account.value, e.target.checked)}
                    color="primary"
                  />
                }
                label={account.label}
                className={styles.checkboxItem}
              />
            ))}
          </div>
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