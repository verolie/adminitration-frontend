import * as React from "react";
import styles from "./styles.module.css";
import Button from "@/component/button/button";
import { useAlert } from "@/context/AlertContext";
import { exportGenerateLaporanNeracaExcel } from '../function/generateLaporanNeracaExcel';
import { fetchGenerateLaporanNeraca } from '../function/fetchGenerateLaporanNeraca';
import { TextField, CircularProgress } from "@mui/material";

const columns = [
  { label: "Kode Akun", sub: "(1)" },
  { label: "Nama Akun", sub: "(2)" },
  { label: "Nilai", sub: "(3)" },
];

function getDefaultYear() {
  return new Date().getFullYear();
}

function getYearDates(year: number) {
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;
  return { start, end };
}

export default function GenerateLaporanNeraca() {
  const defaultYear = getDefaultYear();
  const [selectedYear, setSelectedYear] = React.useState(defaultYear);
  const [inputYear, setInputYear] = React.useState(String(defaultYear));
  const [data, setData] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { showAlert } = useAlert();

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputYear(e.target.value);
  };

  const handleYearBlur = () => {
    const year = parseInt(inputYear);
    if (!isNaN(year) && year >= 1900 && year <= 9999) {
      setSelectedYear(year);
    } else {
      // Reset to previous valid year if input is invalid
      setInputYear(String(selectedYear));
      showAlert("Tahun harus antara 1900 dan 9999", "error");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  const fetchData = React.useCallback(async (year: number) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token") || "dummy-token";
      const companyId = localStorage.getItem("companyID") || "dummy-company";
      const { start, end } = getYearDates(year);
      const result = await fetchGenerateLaporanNeraca(companyId, token, start, end);
      setData(result);
    } catch (err) {
      console.error("Error fetching data:", err);
      setData([]);
      showAlert("Gagal mengambil data laporan neraca", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showAlert]);

  React.useEffect(() => {
    fetchData(selectedYear);
  }, [selectedYear, fetchData]);

  const handleGenerateExcel = async () => {
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyID");
      
      if (!token || !companyId) {
        showAlert("Token atau Company ID tidak tersedia", "error");
        return;
      }

      const { start, end } = getYearDates(selectedYear);
      await exportGenerateLaporanNeracaExcel(companyId, token, start, end, data);
      showAlert("Excel berhasil di-generate", "success");
    } catch (error) {
      console.error("Error generating excel:", error);
      showAlert("Gagal generate excel", "error");
    }
  };

  // Split data into assets (1xx) and liabilities/equity (2xx and 3xx)
  const assetsData = data.filter(row => row.kode_akun?.startsWith('1') || (row.kode_akun === null && row.nama_akun?.includes('Aset')));
  const liabilitiesEquityData = data.filter(row => 
    row.kode_akun?.startsWith('2') || 
    row.kode_akun?.startsWith('3') || 
    (row.kode_akun === null && (row.nama_akun?.includes('Liabilitas') || row.nama_akun?.includes('Ekuitas')))
  );

  const renderTable = (tableData: any[]) => (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.label}
              className={
                styles.stickyHeader +
                (col.label === "Nama Akun" ? " " + styles.namaAkunCol : " " + styles.uniformCol)
              }
            >
              <div>{col.label}</div>
              <div className={styles.colSub}>{col.sub}</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, idx) => {
          const isGreyRow = row.is_header || row.formula !== null;
          const nilaiText = row.nilai !== null && row.nilai !== undefined ? row.nilai.toLocaleString('id-ID') : '';
          
          return (
            <tr key={idx}>
              <td className={isGreyRow ? styles.greyCell + " " + styles.uniformCol : styles.uniformCol}>
                {row.kode_akun || ''}
              </td>
              <td className={styles.namaAkunCol}>
                {Array(row.indent_num).fill('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0').join('')}
                {row.nama_akun}
              </td>
              <td className={isGreyRow ? styles.greyCell + " " + styles.uniformCol : styles.uniformCol}>
                {nilaiText}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.titleText}>Laporan Neraca SPT</h2>
      
      {/* Action buttons row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className={styles.dateFieldsContainer}>
          <div className={styles.dateFieldContainer}>
            <label className={styles.dateFieldLabel}>Tahun:</label>
            <TextField
              type="number"
              value={inputYear}
              onChange={handleYearChange}
              onBlur={handleYearBlur}
              onKeyPress={handleKeyPress}
              inputProps={{ min: 1900, max: 9999 }}
              sx={{ width: '150px' }}
              size="small"
            />
          </div>
        </div>
        <Button
          size="large"
          variant="confirm"
          label="Generate Excel"
          onClick={handleGenerateExcel}
        />
      </div>
      
      <div className={styles.tablesContainer}>
        {isLoading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            width: '100%',
            minHeight: '200px'
          }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <div className={styles.tableContainer}>
              {renderTable(assetsData)}
            </div>
            <div className={styles.tableContainer}>
              {renderTable(liabilitiesEquityData)}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 
