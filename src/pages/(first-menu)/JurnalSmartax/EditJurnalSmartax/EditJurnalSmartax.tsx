import * as React from "react";
import styles from "./styles.module.css";
import { Typography } from "@mui/material";
import Button from "../../../../component/button/button";
import DatePickerField from "../../../../component/textField/dateAreaText";
import FieldText from "../../../../component/textField/fieldText";
import TableInsertSmartTax from "../function/TableInsertSmartTax";
import { editJurnalSmartax } from "../function/editJurnalSmartax";
import { fetchJurnalSmartaxDetail } from "../function/fetchJurnalSmartaxDetail";
import { fetchLawanTransaksi } from "../function/fetchLawanTransaksi";

interface EditJurnalSmartaxProps {
  id: string;
  onClose: () => void;
}

type RowData = {
  no: string;
  lawanTransaksi: string;
  bukti: string;
  debit: string;
  kredit: string;
  keterangan: string;
};

export default function EditJurnalSmartax({ id, onClose }: EditJurnalSmartaxProps) {
  const [rows, setRows] = React.useState<RowData[]>([
    { no: "", lawanTransaksi: "", bukti: "", debit: "", kredit: "", keterangan: "" },
  ]);
  const [totalDebit, setTotalDebit] = React.useState(0);
  const [totalKredit, setTotalKredit] = React.useState(0);
  const [tanggalValue, setTanggalValue] = React.useState("");
  const [fakturValue, setFakturValue] = React.useState("");
  const [deskripsiValue, setDeskripsiValue] = React.useState("");
  const [fileUpload, setFileUpload] = React.useState<File | null>(null);
  const [lawanTransaksiList, setLawanTransaksiList] = React.useState<any[]>([]);

  const handleRowChange = (index: number, field: string, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index][field as keyof RowData] = value;
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      { no: "", lawanTransaksi: "", bukti: "", debit: "", kredit: "", keterangan: "" },
    ]);
  };

  const handleDeleteRow = (index: number) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  React.useEffect(() => {
    let debit = 0;
    let kredit = 0;

    rows.forEach((row) => {
      debit += parseFloat(row.debit) || 0;
      kredit += parseFloat(row.kredit) || 0;
    });

    setTotalDebit(debit);
    setTotalKredit(kredit);
  }, [rows]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyID");
        if (!token || !companyId) return;

        const [jurnalData, lawanTransaksiData] = await Promise.all([
          fetchJurnalSmartaxDetail(id, token),
          fetchLawanTransaksi(token, companyId)
        ]);

        setTanggalValue(jurnalData.tgl);
        setFakturValue(jurnalData.faktur);
        setDeskripsiValue(jurnalData.deskripsi);
        setRows(
          jurnalData.jurnal_detail.map((detail: any) => ({
            no: "",
            lawanTransaksi: detail.lawan_transaksi,
            bukti: detail.bukti,
            debit: detail.debit.toString(),
            kredit: detail.kredit.toString(),
            keterangan: detail.keterangan,
          }))
        );
        setLawanTransaksiList(lawanTransaksiData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async () => {
    if (totalDebit !== totalKredit) {
      alert("Total debit dan kredit harus seimbang.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyID");
      let fileBase64 = "";

      if (fileUpload) {
        fileBase64 = await toBase64(fileUpload);
      }

      if (companyId && token) {
        const data = {
          id,
          faktur: fakturValue,
          tgl: tanggalValue,
          totalDebit,
          totalKredit,
          companyId,
          deskripsi: deskripsiValue,
          file: fileBase64,
          jurnalDetail: rows.map((row, index) => ({
            lawanTransaksi: row.lawanTransaksi,
            bukti: row.bukti,
            debit: parseFloat(row.debit) || 0,
            kredit: parseFloat(row.kredit) || 0,
            urut: index + 1,
            keterangan: row.keterangan,
          })),
        };

        const result = await editJurnalSmartax(data, token);
        alert(`Jurnal Smartax berhasil diperbarui: ${result}`);
        onClose();
      }
    } catch (error: any) {
      alert(`Gagal memperbarui jurnal: ${error.message}`);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileUpload(file);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.scrollContent}>
        <div className={styles.titleField}>
          <Typography className={styles.titleText}>Data Faktur</Typography>
        </div>
        <div className={styles.filterContainer}>
          <div className={styles.rowContainer}>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Tanggal</Typography>
              <DatePickerField
                value={tanggalValue}
                onChange={(e) => setTanggalValue(e.target.value as string)}
                sx={{ width: "100%" }}
              />
            </div>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Nomor Faktur</Typography>
              <FieldText
                label="Nomor Faktur"
                value={fakturValue}
                onChange={(e) => setFakturValue(e.target.value)}
                sx={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        <div className={styles.filterContainer}>
          <div className={styles.rowContainer}>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Deskripsi</Typography>
              <FieldText
                label="Deskripsi"
                value={deskripsiValue}
                onChange={(e) => setDeskripsiValue(e.target.value)}
                sx={{ width: "100%" }}
              />
            </div>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Upload File</Typography>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        <div className={styles.titleField}>
          <Typography className={styles.titleText}>Data Jurnal</Typography>
        </div>
        <TableInsertSmartTax
          rows={rows}
          lawanTransaksiList={lawanTransaksiList}
          onChange={handleRowChange}
          addRow={handleAddRow}
          deleteRow={handleDeleteRow}
        />

        <div className={styles.filterContainer}>
          <div className={styles.rowContainer}>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Total Debit</Typography>
              <FieldText
                label="0"
                value={totalDebit.toString()}
                onChange={() => {}}
                sx={{ width: "100%" }}
                disabled={true}
              />
            </div>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Total Kredit</Typography>
              <FieldText
                label="0"
                value={totalKredit.toString()}
                onChange={() => {}}
                sx={{ width: "100%" }}
                disabled={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.buttonLabel}>
        <Button
          size="large"
          variant="confirm"
          label="Save"
          onClick={onSubmit}
        />
        <Button
          size="large"
          variant="info"
          label="Save As Draft"
          onClick={onSubmit}
        />
      </div>
    </div>
  );
} 