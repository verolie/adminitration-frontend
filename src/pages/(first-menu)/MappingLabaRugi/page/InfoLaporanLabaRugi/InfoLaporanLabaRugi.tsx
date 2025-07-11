import * as React from "react";
import styles from "./styles.module.css";
import AutocompleteTextField, { OptionType } from "@/component/textField/autoCompleteText";
import Button from "@/component/button/button";
import { Add, Edit } from "@mui/icons-material";
import Tag from "@/component/tag/tag";
import { TableRow } from "../../model/laporanLabaRugiModel";
import { fetchLaporanLabaRugi } from "../../function/fetchLaporanLabaRugi";
import { useAlert } from "@/context/AlertContext";
import { fetchAkunPerkiraanDetail } from "../../function/fetchAkunPerkiraanDetail";
import { bulkUpdateLaporanLabaRugi } from "../../function/bulkUpdate";
import { useAppContext } from '@/context/context';
import PopupMappingLabaRugi from "@/component/popupMappingLabaRugi/popupMappingLabaRugi";

interface InfoLaporanLabaRugiProps {
  onGenerate?: () => void;
}

interface MappingRow {
  id: string;
  field1: string;
  operator: string;
  field2: string;
}

export default function InfoLaporanLabaRugi({ onGenerate }: InfoLaporanLabaRugiProps) {
  const [tableData, setTableData] = React.useState<TableRow[]>([]);
  const [selectedOptions, setSelectedOptions] = React.useState<{ [key: string]: OptionType | undefined }>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [initialTableData, setInitialTableData] = React.useState<TableRow[]>([]);
  const [hasChanges, setHasChanges] = React.useState(false);
  const { showAlert } = useAlert();
  const [akunPerkiraanOptions, setAkunPerkiraanOptions] = React.useState<OptionType[]>([]);
  const { addTab } = useAppContext();
  const [showMappingPopup, setShowMappingPopup] = React.useState(false);
  const [selectedRowId, setSelectedRowId] = React.useState<string>("");

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

  const handleEditMapping = (rowId: string) => {
    setSelectedRowId(rowId);
    setShowMappingPopup(true);
  };

  const handleSaveMapping = (mappings: MappingRow[]) => {
    // TODO: Implement save mapping logic
    console.log("Saving mappings for row:", selectedRowId, mappings);
    showAlert("Mapping berhasil disimpan", "success");
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
          laporan_laba_rugi_id: parseInt(row.id),
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
          onClick={onGenerate}
        />
      </div>
      <div className={styles.scrollContent}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Kode Akun Laporan</th>
                <th>Nama Akun Laporan</th>
                <th className={styles.akunPerkiraanTerpilihColumn}>Akun Perkiraan Terpilih</th>
                <th>Action</th>
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
                  <td>
                    {!row.is_header && row.formula != null && (
                      <Button
                        size="small"
                        variant="info"
                        icon={<Edit sx={{ fontSize: 19.2 }} />}
                        onClick={() => handleEditMapping(row.id)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PopupMappingLabaRugi
        open={showMappingPopup}
        onClose={() => setShowMappingPopup(false)}
        onSave={handleSaveMapping}
        akunPerkiraanOptions={akunPerkiraanOptions}
      />
    </div>
  );
} 