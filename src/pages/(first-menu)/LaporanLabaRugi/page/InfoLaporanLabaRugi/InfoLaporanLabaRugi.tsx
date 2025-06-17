import * as React from "react";
import styles from "./styles.module.css";
import AutocompleteTextField, { OptionType } from "@/component/textField/autoCompleteText";
import Button from "@/component/button/button";
import { Add } from "@mui/icons-material";
import Tag from "@/component/tag/tag";
import { TableRow } from "../../model/laporanLabaRugiModel";
import { fetchLaporanLabaRugi } from "../../function/fetchLaporanLabaRugi";
import { useAlert } from "@/context/AlertContext";

// Hardcoded data for demonstration
const hardcodedAkunPerkiraan = [
  { label: "1001 - Kas", value: "1" },
  { label: "1002 - Bank", value: "2" },
  { label: "2001 - Hutang Usaha", value: "3" },
  { label: "3001 - Modal", value: "4" },
  { label: "4001 - Pendapatan", value: "5" },
  { label: "5001 - Beban", value: "6" },
];

export default function InfoLaporanLabaRugi() {
  const [tableData, setTableData] = React.useState<TableRow[]>([]);
  const [selectedOptions, setSelectedOptions] = React.useState<{ [key: string]: OptionType | undefined }>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const { showAlert } = useAlert();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyID");

      if (!token || !companyId) {
        showAlert("Token atau Company ID tidak tersedia", "error");
        return;
      }

      const data = await fetchLaporanLabaRugi({ companyId }, token);
      setTableData(data);
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

  if (isLoading) {
    return <div className={styles.loadingText}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.scrollContent}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Kode Akun Laporan</th>
                <th>Nama Akun Laporan</th>
                <th>Pilih Akun Perkiraan</th>
                <th>Akun Perkiraan Terpilih</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id} style={{ backgroundColor: row.is_header ? '#f5f5f5' : 'transparent' }}>
                  <td>{row.kode_akun}</td>
                  <td>{"  ".repeat(row.indent_num)}{row.nama_akun}</td>
                  <td>
                    {!row.is_header && (
                      <div className={styles.panel}>
                        <AutocompleteTextField
                          label="Objek Pajak"
                          options={hardcodedAkunPerkiraan}
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
                  <td>
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