import * as React from "react";
import styles from "./styles.module.css";
import { Typography } from "@mui/material";
import SelectedTextField from "@/component/textField/selectedText";
import FieldText from "@/component/textField/fieldText";
import Button from "@/component/button/button";
import DatePickerField from "@/component/textField/dateAreaText";
import AreaText from "@/component/textField/areaText";
import TableInsertManual from "@/component/tableInsertManual/tableInserManual";
import { createJurnalUmum } from "../function/createJurnalUmum";
import { fetchAkunPerkiraanDetail } from "../function/fetchAkunPerkiraanDetail";
import { JurnalUmum } from "../model/JurnalUmumModel";

type RowData = {
  no: string;
  rekening: string;
  bukti: string;
  debit: string;
  kredit: string;
  keterangan: string;
  tanggal: string;
};

type Column<T> = {
  field: keyof T;
  label: string;
  type: "text" | "select" | "date";
  options?: { label: string; value: string }[]; // Only for "select" type
};

export default function DataBaru() {
  const [kodeAkunValue, setKodeAkunValue] = React.useState("");
  const [totalDebit, setTotalDebit] = React.useState(0);
  const [totalKredit, setTotalKredit] = React.useState(0);
  const [tanggalValue, setTanggalValue] = React.useState("");
  const [buktiValue, setBuktiValue] = React.useState("");
  const [deskripsiValue, setDeskripsiValue] = React.useState(""); // State untuk Deskripsi
  const [fileUpload, setFileUpload] = React.useState<File | null>(null); // State untuk File Upload
  const [rows, setRows] = React.useState<RowData[]>([
    {
      no: "",
      rekening: "",
      bukti: "",
      debit: "",
      kredit: "",
      keterangan: "",
      tanggal: "",
    },
  ]);
  const [akunOptions, setAkunOptions] = React.useState<
    { value: string; label: string }[]
  >([]);

  const columns: Column<RowData>[] = React.useMemo(
    () => [
      {
        field: "rekening",
        label: "Rekening",
        type: "select",
        options: akunOptions,
      },
      { field: "bukti", label: "Bukti", type: "text" },
      { field: "debit", label: "Debit", type: "text" },
      { field: "kredit", label: "Kredit", type: "text" },
      { field: "keterangan", label: "Keterangan", type: "text" },
    ],
    [akunOptions]
  );

  React.useEffect(() => {
    const fetchAkun = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyID");

        if (!token || !companyId) return;

        const data = await fetchAkunPerkiraanDetail(
          { companyId }, // pastikan AkunPerkiraan hanya butuh ini
          token
        );

        console.log("contoh ", data);
        const akunList = data.map((akun: any) => ({
          value: akun.id.toString(),
          label: `${akun.kode_akun} - ${akun.nama_akun}`,
        }));

        setAkunOptions(akunList);
      } catch (err) {
        console.error("Gagal fetch akun:", err);
      }
    };

    fetchAkun();
  }, []);
  const handleRowChange = (
    index: number,
    field: keyof RowData,
    value: string
  ) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        no: "",
        rekening: "",
        bukti: "",
        debit: "",
        kredit: "",
        keterangan: "",
        tanggal: "",
      },
    ]);
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

  const handleDeleteRow = (index: number) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  // Fungsi untuk mengubah file menjadi base64
  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = (status: "active" | "submit") => async () => {
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
        const data: JurnalUmum = {
          faktur: kodeAkunValue,
          tgl: tanggalValue,
          totalDebit: totalDebit,
          totalKredit: totalKredit,
          companyId: companyId,
          deskripsi: deskripsiValue, // Sertakan deskripsi
          file: fileBase64, // Sertakan file base64,
          jurnalDetail: rows.map((row, index) => ({
            akunPerkiraanDetailId: Number(row.rekening),
            bukti: row.bukti,
            debit: parseFloat(row.debit) || 0,
            kredit: parseFloat(row.kredit) || 0,
            urut: index + 1,
            keterangan: row.keterangan,
          })),
        };

        const result = await createJurnalUmum(data, token);
        alert(`Jurnal berhasil disimpan: ${result}`);
      }
    } catch (error: any) {
      alert(`Gagal menyimpan jurnal: ${error.message}`);
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
              <Typography className={styles.labelText}>Nomor Faktur</Typography>
              <FieldText
                label="Nomor Faktur"
                value={kodeAkunValue}
                onChange={(e) => setKodeAkunValue(e.target.value)}
                sx={{ width: "100%" }}
              />
            </div>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Tanggal</Typography>
              <DatePickerField
                value={tanggalValue}
                onChange={(e) => setTanggalValue(e.target.value)}
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
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" // Atur jenis file yang diterima
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        <div className={styles.titleField}>
          <Typography className={styles.titleText}>Data Jurnal</Typography>
        </div>
        <TableInsertManual
          rows={rows}
          onChange={handleRowChange}
          addRow={handleAddRow}
          deleteRow={handleDeleteRow}
          columns={columns}
        />

        <div className={styles.container}>
          <div className={styles.rowContainer}>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Total Debit</Typography>
              <FieldText
                label="0"
                value={totalDebit.toString()}
                onChange={(e) => setKodeAkunValue(e.target.value)}
                sx={{ width: "100%" }}
                disabled={true}
              />
            </div>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Total Kredit</Typography>
              <FieldText
                label="0"
                value={totalKredit.toString()}
                onChange={(e) => setKodeAkunValue(e.target.value)}
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
          onClick={onSubmit("active")}
        />
        <Button
          size="large"
          variant="info"
          label="Save As Draft"
          onClick={onSubmit("submit")}
        />
      </div>
    </div>
  );
}
