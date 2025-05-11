import * as React from "react";
import styles from "./styles.module.css";
import { Typography } from "@mui/material";
import Button from "@/component/button/button";
import AutocompleteTextField, { OptionType } from "@/component/textField/autoCompleteText";
import { fetchAkunPerkiraan } from "../../function/fetchAkunPerkiraan"; // Import the fetch function
import { fetchObjekPajakData } from "../../function/fetchObjekPajakDataMember"; // Import the fetch function for Master Tax
import { saveMasterTax } from "../../function/saveMasterTax"; // Import the save function

interface ModifyMasterTaxProps {
  onClose: () => void;
}

export default function ModifyMasterTax({ onClose }: ModifyMasterTaxProps) {
  const [selectedAkunPerkiraan, setSelectedAkunPerkiraan] = React.useState<OptionType | undefined>(undefined);
  const [selectedMasterTax, setSelectedMasterTax] = React.useState<OptionType | undefined>(undefined);
  const [akunPerkiraanOptions, setAkunPerkiraanOptions] = React.useState<OptionType[]>([]);
  const [masterTaxOptions, setMasterTaxOptions] = React.useState<OptionType[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyID");
      if (!token || !companyId) return;

      try {
        const akunData = await fetchAkunPerkiraan({ companyId, page: 1, limit: 100 }, token);
        setAkunPerkiraanOptions(akunData); // Set the fetched options for Akun Perkiraan

        const masterTaxData = await fetchObjekPajakData({ companyId, page: 1, limit: 100 }, token);
        const masterTaxOptions = masterTaxData.map((item: any) => ({
          label: item.kodeObjek + " - " + item.namaObjek, // Use nama_objek for the label
          value: item.id, // Use kode_objek for the value
        }));
        setMasterTaxOptions(masterTaxOptions); // Set the fetched options for Master Tax
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("companyID");

    if (!token || !companyId || !selectedAkunPerkiraan || !selectedMasterTax) {
      console.error("Missing required data for submission");
      return;
    }

    try {
      const result = await saveMasterTax(
        companyId,
        parseInt(selectedAkunPerkiraan.value), // Assuming value is a string
        parseInt(selectedMasterTax.value), // Assuming value is a string
        token
      );
      console.log("Master Tax saved successfully:", result);
    } catch (error) {
      console.error("Error saving Master Tax:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.scrollContent}>
        <div className={styles.titleField}>
          <Typography className={styles.titleText}>Modify Master Tax</Typography>
        </div>

        <div className={styles.filterContainer}>
          <div className={styles.rowContainer}>
          <div className={styles.inputField}>
              <Typography className={styles.labelText}>Master Tax</Typography>
              <AutocompleteTextField
                label="Master Tax"
                options={masterTaxOptions}
                value={selectedMasterTax}
                onChange={(option: OptionType | null) => setSelectedMasterTax(option || undefined)}
                size="large"
              />
            </div>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Akun Perkiraan</Typography>
              <AutocompleteTextField
                label="Akun Perkiraan"
                options={akunPerkiraanOptions}
                value={selectedAkunPerkiraan}
                onChange={(option: OptionType | null) => setSelectedAkunPerkiraan(option || undefined)}
                size="large"
              />
            </div>
          </div>
        </div>

        <div className={styles.buttonLabel}>
          <Button
            size="large"
            variant="confirm"
            label="Save"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}