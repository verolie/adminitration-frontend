import * as React from "react";
import styles from "./styles.module.css";
import AutocompleteTextField, { OptionType } from "@/component/textField/autoCompleteText";
import Button from "@/component/button/button";
import { Add } from "@mui/icons-material";
import Tag from "@/component/tag/tag";
import { TableRow } from "../../model/laporanLabaRugiModel";
import { fetchLaporanLabaRugi } from "../../function/fetchLaporanLabaRugi";
import { useAlert } from "@/context/AlertContext";
import { fetchAkunPerkiraanDetail } from "../../function/fetchAkunPerkiraanDetail";
import { bulkUpdateLaporanLabaRugi } from "../../function/bulkUpdate";

export default function InfoLaporanLabaRugi() {
  const [tableData, setTableData] = React.useState<TableRow[]>([]);
  const [selectedOptions, setSelectedOptions] = React.useState<{ [key: string]: OptionType | undefined }>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [initialTableData, setInitialTableData] = React.useState<TableRow[]>([]);
  const [hasChanges, setHasChanges] = React.useState(false);
  const { showAlert } = useAlert();
  const [akunPerkiraanOptions, setAkunPerkiraanOptions] = React.useState<OptionType[]>([]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyID");

      if (!token || !companyId) {
        showAlert("Token atau Company ID tidak tersedia", "error");
        return;
      }

      const data = await fetchLaporanLabaRugi({ companyId }, token);
      // Map akun_perkiraan_details to selectedAkun for each row
      const mappedData = data.map((row: any) => ({
        ...row,
        selectedAkun: (row.akun_perkiraan_details || []).map((akun: any) => ({
          label: `${akun.kode_akun} - ${akun.nama_akun}`,
          value: akun.id?.toString() ?? '',
        })),
      }));
      setTableData(mappedData);
      setInitialTableData(mappedData); // Save initial data for change detection
    } catch (error) {
      console.error("Error fetching data:", error);
      showAlert("Gagal mengambil data laporan laba rugi", "error");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  // Fetch akun perkiraan detail for dropdown
  React.useEffect(() => {
    const fetchAkun = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyID");
        if (!token || !companyId) return;
        const data = await fetchAkunPerkiraanDetail({ companyId }, token);
        const options = data.map((akun: any) => ({
          value: akun.id?.toString() ?? '',
          label: `${akun.kode_akun} - ${akun.nama_akun}`,
        }));
        setAkunPerkiraanOptions(options);
      } catch (err) {
        console.error("Gagal fetch akun perkiraan detail:", err);
      }
    };
    fetchAkun();
  }, []);

  // Detect changes in selectedAkun
  React.useEffect(() => {
    // Compare selectedAkun arrays for all rows
    const isChanged = tableData.some((row, idx) => {
      const initial = initialTableData[idx];
      if (!initial) return true;
      const currAkun = row.selectedAkun?.map(a => a.value).join(',') || '';
      const initAkun = initial.selectedAkun?.map(a => a.value).join(',') || '';
      return currAkun !== initAkun;
    });
    setHasChanges(isChanged);
  }, [tableData, initialTableData]);

  const handleTambahData = (rowId: string) => {
    const selectedOption = selectedOptions[rowId];
    if (selectedOption) {
      setTableData(prevData => 
        prevData.map(row => 
          row.id === rowId 
            ? { ...row, selectedAkun: [...(row.selectedAkun || []), selectedOption] }
            : row
        )
      );
      setSelectedOptions(prev => ({ ...prev, [rowId]: undefined }));
    }
  };

  const handleRemoveAkun = (rowId: string, indexToRemove: number) => {
    setTableData(prevData =>
      prevData.map(row =>
        row.id === rowId
          ? { ...row, selectedAkun: row.selectedAkun.filter((_, index) => index !== indexToRemove) }
          : row
      )
    );
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyID");
      
      if (!token || !companyId) {
        showAlert("Token atau Company ID tidak tersedia", "error");
        return;
      }

      const updateData = tableData
        .filter(row => !row.is_header && row.formula == null && row.selectedAkun?.length > 0)
        .map(row => ({
          id: parseInt(row.id),
          akun_perkiraan_detail_ids: row.selectedAkun.map(akun => parseInt(akun.value))
        }));

      if (updateData.length === 0) {
        showAlert("Tidak ada data yang akan disimpan", "error");
        return;
      }

      await bulkUpdateLaporanLabaRugi(updateData, token, companyId);
      showAlert("Data berhasil disimpan", "success");
      await fetchData(); // Refresh data after successful save
      setHasChanges(false); // Reset changes flag after successful save
    } catch (error) {
      console.error("Error saving data:", error);
      showAlert("Gagal menyimpan data", "error");
    }
  };

  if (isLoading) {
    return <div className={styles.loadingText}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Action buttons row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, justifyContent: 'flex-end' }}>
        <Button
          size="large"
          variant={hasChanges ? "confirm" : "disable"}
          label="Save"
          onClick={handleSubmit}
          disabled={!hasChanges}
        />
        <Button
          size="large"
          variant="info"
          label="Generate Report"
          onClick={() => { /* TODO: Generate report handler */ }}
        />
      </div>
      <div className={styles.scrollContent}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Kode Akun Laporan</th>
                <th>Nama Akun Laporan</th>
                <th className={styles.akunPerkiraanDetailDropdown}>Pilih Akun Perkiraan</th>
                <th className={styles.akunPerkiraanTerpilihColumn}>Akun Perkiraan Terpilih</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id} style={{ backgroundColor: row.is_header || row.formula != null ? '#f5f5f5' : 'transparent' }}>
                  <td>{row.kode_akun}</td>
                  <td>
                    {Array(row.indent_num).fill('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0').join('')}
                    {row.nama_akun}
                  </td>
                  <td>
                    {!row.is_header && row.formula == null && (
                      <div className={styles.panel}>
                        <AutocompleteTextField
                          label="Akun Perkiraan"
                          options={akunPerkiraanOptions}
                          value={selectedOptions[row.id]}
                          onChange={(option) => setSelectedOptions(prev => ({ ...prev, [row.id]: option }))}
                          size="large"
                        />
                        <Button
                          size="small"
                          variant="confirm"
                          icon={<Add sx={{ color: "white" }} />}
                          onClick={() => handleTambahData(row.id)}
                        />
                      </div>
                    )}
                  </td>
                  <td className={styles.akunPerkiraanTerpilihColumn}>
                    <div className={styles.tagPanel}>
                      {row.selectedAkun?.map((item, idx) => (
                        <Tag
                          key={idx}
                          label={item.label}
                          onCancel={() => handleRemoveAkun(row.id, idx)}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 