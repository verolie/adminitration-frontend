import * as React from "react";
import styles from "./styles.module.css";
import { Typography } from "@mui/material";
import Button from "@/component/button/button";
import AutocompleteTextField, { OptionType } from "@/component/textField/autoCompleteText";
import { useAlert } from "@/context/AlertContext";
import { fetchAkunPerkiraan } from "../../function/fetchAkunPerkiraanDetail"; // Import the fetch function
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
  const { showAlert } = useAlert();

  // Add pagination and loading states
  const [currentPage, setCurrentPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const ITEMS_PER_PAGE = 20;

  React.useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyID");
      if (!token || !companyId) return;

      try {
        // Fetch initial Akun Perkiraan data
        await fetchAkunPerkiraanList(1);

        const masterTaxData = await fetchObjekPajakData({ companyId, page: 1, limit: 100 }, token);
        const masterTaxOptions = masterTaxData.map((item: any) => ({
          label: item.kodeObjek + " - " + item.namaObjek,
          value: item.id,
        }));
        setMasterTaxOptions(masterTaxOptions);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchAkunPerkiraanList = async (page: number) => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("companyID");
    if (!token || !companyId || !hasMore || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const akunData = await fetchAkunPerkiraan({ companyId, page, limit: ITEMS_PER_PAGE }, token);
      
      const options = akunData.map((item: any) => ({
        label: `${item.kode_akun} - ${item.nama_akun}`,
        value: item.id,
      }));

      if (page === 1) {
        setAkunPerkiraanOptions(options);
      } else {
        setAkunPerkiraanOptions(prev => [...prev, ...options]);
      }

      // If we received fewer items than the limit, we've reached the end
      setHasMore(options.length === ITEMS_PER_PAGE);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch Akun Perkiraan data:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleScrollAkunPerkiraan = () => {
    if (hasMore && !isLoadingMore) {
      fetchAkunPerkiraanList(currentPage + 1);
    }
  };

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
        parseInt(selectedAkunPerkiraan.value),
        parseInt(selectedMasterTax.value),
        token
      );
      showAlert("Data saved successfully:", "success");
      console.log("Master Tax saved successfully:", result);
    } catch (error) {
      showAlert("Error saving Master Tax:", "error");
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
                onChange={(option: OptionType | undefined) => setSelectedMasterTax(option || undefined)}
                size="large"
              />
            </div>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Akun Perkiraan</Typography>
              <AutocompleteTextField
                label="Akun Perkiraan"
                options={akunPerkiraanOptions}
                value={selectedAkunPerkiraan}
                onChange={(option: OptionType | undefined) => setSelectedAkunPerkiraan(option || undefined)}
                size="large"
                onScrollEnd={handleScrollAkunPerkiraan}
                isLoading={isLoadingMore}
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