import * as React from "react";
import styles from "./styles.module.css";
import { fetchGenerateLaporanLabaRugi, GenerateLaporanLabaRugiRow } from "../../function/fetchGenerateLaporanLabaRugi";
import { fetchLaporanLabaRugi } from "../../function/fetchLaporanLabaRugi";

import { saveAs } from 'file-saver';

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

const headerRow = [
  'KODE AKUN',
  'NAMA AKUN',
  'NILAI (KOMERSIAL)',
  'TIDAK TERMASUK OBJEK PAJAK',
  'DIKENAKAN PPH BERSIFAT FINAL',
  'OBJEK PAJAK TIDAK FINAL',
  'PENYESUAIAN FISKAL POSITIF',
  'PENYESUAIAN FISKAL NEGATIF',
  'KODE PENYESUAIAN FISKAL',
  'NILAI FISKAL (Sebelum Fasilitas Perpajakan)',
];
const subHeaderRow = [
  '(1)', '(2)', '(3)', '(4)', '(5)', '(6)=(3)-(4)-(5)', '(7)', '(8)', '(9)', '(10)'
];
const colFieldMap = [
  null, // 0: KODE AKUN
  null, // 1: NAMA AKUN
  'nilai_komersial',
  'tidak_termasuk_objek_pajak',
  'dikenakan_pph_bersifat_final',
  'objek_pajak_tidak_final',
  'penyesuaian_fiskal_positif',
  'penyesuaian_fiskal_negatif',
  'kode_penyesuaian_fiskal',
  'nilai_fiskal',
];

export default function GenerateLaporanLabaRugi() {
  const [data, setData] = React.useState<GenerateLaporanLabaRugiRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isExporting, setIsExporting] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token") || "dummy-token";
        const companyId = localStorage.getItem("companyID") || "dummy-company";
        const result = await fetchLaporanLabaRugi({ companyId }, token);
        setData(result as any); // fix linter error
      } catch (err) {
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);


  return (
    <div className={styles.container}>
      <h2 className={styles.titleText}>Laporan Laba Rugi</h2>
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
              data.map((row, idx) => {
                const mapping = (row as any).KolomLaporanLabaRugi;
                return (
                  <tr key={idx}>
                    <td className={row.is_header ? styles.greyCell + " " + styles.uniformCol : styles.uniformCol}>{row.kode_akun}</td>
                    <td className={styles.namaAkunCol}>
                      {Array(row.indent_num).fill('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0').join('')}{row.nama_akun}
                    </td>
                    <td className={(!mapping || mapping.nilai_komersial === false) ? styles.greyCell + " " + styles.uniformCol : styles.uniformCol}>
                      {row.nilai_komersial ?? ""}
                    </td>
                    <td className={(!mapping || mapping.tidak_termasuk_objek_pajak === false) ? styles.greyCell + " " + styles.uniformCol : styles.uniformCol}>
                      {row.tidak_termasuk_objek_pajak ?? ""}
                    </td>
                    <td className={(!mapping || mapping.dikenakan_pph_bersifat_final === false) ? styles.greyCell + " " + styles.uniformCol : styles.uniformCol}>
                      {row.dikenakan_pph_bersifat_final ?? ""}
                    </td>
                    <td className={(!mapping || mapping.objek_pajak_tidak_final === false) ? styles.greyCell + " " + styles.uniformCol : styles.uniformCol}>
                      {row.objek_pajak_tidak_final ?? ""}
                    </td>
                    <td className={(!mapping || mapping.penyesuaian_fiskal_positif === false) ? styles.greyCell + " " + styles.uniformCol : styles.uniformCol}>
                      {row.penyesuaian_fiskal_positif ?? ""}
                    </td>
                    <td className={(!mapping || mapping.penyesuaian_fiskal_negatif === false) ? styles.greyCell + " " + styles.uniformCol : styles.uniformCol}>
                      {row.penyesuaian_fiskal_negatif ?? ""}
                    </td>
                    <td className={(!mapping || mapping.kode_penyesuaian_fiskal === false) ? styles.greyCell + " " + styles.uniformCol : styles.uniformCol}>
                      {row.kode_penyesuaian_fiskal ?? ""}
                    </td>
                    <td className={(!mapping || mapping.nilai_fiskal === false) ? styles.greyCell + " " + styles.nilaiFiskalCol : styles.nilaiFiskalCol}>
                      {row.nilai_fiskal ?? ""}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 