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

      await exportGenerateLaporanLabaRugiExcel(companyId, token, startDate, endDate);
      showAlert("Excel berhasil di-generate", "success");
    } catch (error) {
      console.error("Error generating excel:", error);
      showAlert("Gagal generate excel", "error");
    }
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
                  <td className={row.nilai_komersial === null ? styles.greyCell + " " + styles.uniformCol : styles.uniformCol}>
                    {row.nilai_komersial === null ? '' : String(row.nilai_komersial)}
                  </td>
                  <td className={row.tidak_termasuk_objek_pajak === null ? styles.greyCell + " " + styles.uniformCol : styles.uniformCol}>
                    {row.tidak_termasuk_objek_pajak === null ? '' : String(row.tidak_termasuk_objek_pajak)}
                  </td>
                  <td className={row.dikenakan_pph_bersifat_final === null ? styles.greyCell + " " + styles.uniformCol : styles.uniformCol}>
                    {row.dikenakan_pph_bersifat_final === null ? '' : String(row.dikenakan_pph_bersifat_final)}
                  </td>
                  <td className={row.objek_pajak_tidak_final === null ? styles.greyCell + " " + styles.uniformCol : styles.uniformCol}>
                    {row.objek_pajak_tidak_final === null ? '' : String(row.objek_pajak_tidak_final)}
                  </td>
                  <td className={row.penyesuaian_fiskal_positif === null ? styles.greyCell + " " + styles.uniformCol : styles.uniformCol}>
                    {row.penyesuaian_fiskal_positif === null ? '' : String(row.penyesuaian_fiskal_positif)}
                  </td>
                  <td className={row.penyesuaian_fiskal_negatif === null ? styles.greyCell + " " + styles.uniformCol : styles.uniformCol}>
                    {row.penyesuaian_fiskal_negatif === null ? '' : String(row.penyesuaian_fiskal_negatif)}
                  </td>
                  <td className={row.kode_penyesuaian_fiskal === null ? styles.greyCell + " " + styles.uniformCol : styles.uniformCol}>
                    {row.kode_penyesuaian_fiskal === null ? '' : String(row.kode_penyesuaian_fiskal)}
                  </td>
                  <td className={row.nilai_fiskal === null ? styles.greyCell + " " + styles.nilaiFiskalCol : styles.nilaiFiskalCol}>
                    {row.nilai_fiskal === null ? '' : String(row.nilai_fiskal)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 