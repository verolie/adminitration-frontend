import * as React from "react";
import styles from "./styles.module.css";
import { fetchGenerateLaporanLabaRugi, GenerateLaporanLabaRugiRow } from "../../function/fetchGenerateLaporanLabaRugi";
import DatePickerField from "@/component/textField/dateAreaText";
import Button from "@/component/button/button";
import { useAlert } from "@/context/AlertContext";
import { exportGenerateLaporanLabaRugiExcel } from '../function/generateLaporanLabaRugiExcel';

const columns = [
  { label: "Kode Akun", sub: "(1)" },
  { label: "Nama Akun", sub: "(2)" },
  { label: "Nilai (Komersial)", sub: "(3)" },
  { label: "Tidak Termasuk Objek Pajak", sub: "(4)" },
  { label: "Dikenakan PPh Bersifat Final", sub: "(5)" },
  { label: "Objek Pajak Tidak Final", sub: "(6) = (3)-(4)-(5)" },
  { label: "Penyesuaian Fiskal Positif", sub: "(7)" },
  { label: "Penyesuaian Fiskal Negatif", sub: "(8)" },
  { label: "Kode Penyesuaian Fiskal", sub: "(9)" },
  { label: "Nilai Fiskal (Sebelum Fasilitas Perpajakan)", sub: "(10)" },
];

function getDefaultDates() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 10);
  const toISO = (d: Date) => d.toISOString().slice(0, 10);
  return { start: toISO(start), end: toISO(end) };
}

export default function GenerateLaporanLabaRugi() {
  const { start, end } = getDefaultDates();
  const [startDate, setStartDate] = React.useState(start);
  const [endDate, setEndDate] = React.useState(end);
  const [data, setData] = React.useState<GenerateLaporanLabaRugiRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { showAlert } = useAlert();

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value);
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value);

  const fetchData = React.useCallback(async (start_date: string, end_date: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token") || "dummy-token";
      const companyId = localStorage.getItem("companyID") || "dummy-company";
      const result = await fetchGenerateLaporanLabaRugi({ companyId, start_date, end_date }, token);
      setData(result);
    } catch (err) {
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

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

      await exportGenerateLaporanLabaRugiExcel(companyId, token, startDate, endDate, data);
      showAlert("Excel berhasil di-generate", "success");
    } catch (error) {
      console.error("Error generating excel:", error);
      showAlert("Gagal generate excel", "error");
    }
  };

  // Tambahkan handler untuk update cell
  const handleCellChange = (rowIdx: number, field: keyof GenerateLaporanLabaRugiRow, value: string) => {
    setData(prev => prev.map((row, idx) => {
      if (idx !== rowIdx) return row;
      return {
        ...row,
        [field]: value === '' ? 0 : Number(value)
      };
    }));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.titleText}>Laporan Laba Rugi</h2>
      
      {/* Action buttons row */}
      <div style={{ display: 'flex', marginBottom: 20, justifyContent: 'space-between', alignItems: 'center' }}>
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
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.label}
                  className={
                    styles.stickyHeader +
                    (col.label === "Nama Akun" ? " " + styles.namaAkunCol :
                      col.label === "Nilai Fiskal (Sebelum Fasilitas Perpajakan)" ? " " + styles.nilaiFiskalCol :
                      " " + styles.uniformCol)
                  }
                >
                  <div>{col.label}</div>
                  <div className={styles.colSub}>{col.sub}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={columns.length} style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx}>
                  <td className={row.is_header ? styles.greyCell + " " + styles.uniformCol : styles.uniformCol}>{row.kode_akun}</td>
                  <td className={styles.namaAkunCol}>
                    {Array(row.indent_num).fill('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0').join('')}{row.nama_akun}
                  </td>
                  {/* Untuk setiap kolom angka, cek null, jika tidak null render input */}
                  {["nilai_komersial","tidak_termasuk_objek_pajak","dikenakan_pph_bersifat_final","objek_pajak_tidak_final","penyesuaian_fiskal_positif","penyesuaian_fiskal_negatif","kode_penyesuaian_fiskal","nilai_fiskal"].map((field, colIdx) => {
                    const value = row[field as keyof GenerateLaporanLabaRugiRow];
                    const isEditable = value !== null;
                    const colClass = field === "nilai_fiskal" ? styles.nilaiFiskalCol : styles.uniformCol;
                    return (
                      <td key={field} className={isEditable ? colClass : styles.greyCell + " " + colClass}>
                        {isEditable ? (
                          <input
                            type="number"
                            value={String(value ?? 0)}
                            onChange={e => handleCellChange(idx, field as keyof GenerateLaporanLabaRugiRow, e.target.value)}
                            style={{
                              width: '94%',
                              border: 'none',
                              background: 'transparent',
                              padding: '2px 6px',
                              outline: 'none',
                              // borderBottom: '1px solid #ccc',
                              fontSize: 'inherit',
                              textAlign: 'right',
                            }}
                          />
                        ) : ''}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 