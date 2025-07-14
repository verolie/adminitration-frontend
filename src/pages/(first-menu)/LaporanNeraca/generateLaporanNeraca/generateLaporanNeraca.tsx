import * as React from "react";
import styles from "./styles.module.css";
import DatePickerField from "@/component/textField/dateAreaText";
import Button from "@/component/button/button";
import { useAlert } from "@/context/AlertContext";
import { exportGenerateLaporanNeracaExcel } from '../function/generateLaporanNeracaExcel';
import { fetchGenerateLaporanNeraca } from '../function/fetchGenerateLaporanNeraca';

const columns = [
  { label: "Kode Akun", sub: "(1)" },
  { label: "Nama Akun", sub: "(2)" },
  { label: "Nilai", sub: "(3)" },
];

function getDefaultDates() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 10);
  const toISO = (d: Date) => d.toISOString().slice(0, 10);
  return { start: toISO(start), end: toISO(end) };
}

export default function GenerateLaporanNeraca() {
  const { start, end } = getDefaultDates();
  const [startDate, setStartDate] = React.useState(start);
  const [endDate, setEndDate] = React.useState(end);
  const [data, setData] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { showAlert } = useAlert();

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value);
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value);

  const fetchData = React.useCallback(async (start_date: string, end_date: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token") || "dummy-token";
      const companyId = localStorage.getItem("companyID") || "dummy-company";
      
      const result = await fetchGenerateLaporanNeraca(companyId, token, start_date, end_date);
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
    fetchData(startDate, endDate);
  }, [startDate, endDate, fetchData]);

  const handleGenerateExcel = async () => {
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyID");
      
      if (!token || !companyId) {
        showAlert("Token atau Company ID tidak tersedia", "error");
        return;
      }

      await exportGenerateLaporanNeracaExcel(companyId, token, startDate, endDate, data);
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

  if (isLoading) {
    return <div className={styles.loadingText}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.titleText}>Laporan Neraca</h2>
      
      {/* Action buttons row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className={styles.dateFieldsContainer}>
          <div className={styles.dateFieldContainer}>
            <label className={styles.dateFieldLabel}>Start Date:</label>
            <DatePickerField value={startDate} onChange={handleStartDateChange} sx={{ width: '100%' }} />
          </div>
          <div className={styles.dateFieldContainer}>
            <label className={styles.dateFieldLabel}>End Date:</label>
            <DatePickerField value={endDate} onChange={handleEndDateChange} sx={{ width: '100%' }} />
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
        <div className={styles.tableContainer}>
          {renderTable(assetsData)}
        </div>
        <div className={styles.tableContainer}>
          {renderTable(liabilitiesEquityData)}
        </div>
      </div>
    </div>
  );
} 
