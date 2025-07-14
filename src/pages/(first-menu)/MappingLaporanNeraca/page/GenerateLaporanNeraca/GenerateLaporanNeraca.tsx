import * as React from "react";
import styles from "./styles.module.css";
import { fetchLaporanNeraca } from "../../function/fetchLaporanNeraca";

const columns = [
  { label: "Kode Akun", sub: "(1)" },
  { label: "Nama Akun", sub: "(2)" },
  { label: "Nilai", sub: "(3)" },
];

export default function GenerateLaporanNeraca() {
  const [data, setData] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token") || "dummy-token";
        const companyId = localStorage.getItem("companyID") || "dummy-company";
        const result = await fetchLaporanNeraca({ companyId }, token);
        setData(result);
      } catch (err) {
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Split data into assets (1xx) and liabilities/equity (2xx and 3xx)
  const assetsData = data.filter(row => row.kode_akun?.startsWith('1'));
  const liabilitiesEquityData = data.filter(row => row.kode_akun?.startsWith('2') || row.kode_akun?.startsWith('3'));

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
        {tableData.map((row, idx) => (
          <tr key={idx}>
            <td className={row.is_header || row.formula !== null ? styles.greyCell + " " + styles.uniformCol : styles.uniformCol}>
              {row.kode_akun}
            </td>
            <td className={styles.namaAkunCol}>
              {Array(row.indent_num).fill('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0').join('')}
              {row.nama_akun}
            </td>
            <td className={row.is_header || row.formula !== null ? styles.greyCell + " " + styles.uniformCol : styles.uniformCol}>
              {''}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (isLoading) {
    return <div className={styles.loadingText}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.titleText}>Laporan Neraca</h2>
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