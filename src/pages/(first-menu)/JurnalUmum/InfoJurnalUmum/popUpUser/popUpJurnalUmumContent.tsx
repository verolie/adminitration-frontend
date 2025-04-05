"use client";
import FieldText from "@/component/textField/fieldText";
import * as React from "react";
import styles from "./styles.module.css";
import Typography from "@mui/material/Typography";
import SelectedTextField from "@/component/textField/selectedText";
import AreaText from "@/component/textField/areaText";
import DatePickerField from "@/component/textField/dateAreaText";

interface PopUpUserContentProps {
  data: {
    kodeAkun?: string;
    namaAkun?: string;
    jurnal?: string;
    akunPerkiraan?: string;
    debit?: string | number;
    kredit?: string | number;
    tanggal?: string;
    bukti?: string;
    deskripsi?: string;
  };
  mode: "view" | "edit";
}

const accountType = [
  { value: "test 1", label: "test 1" },
  { value: "test 2", label: "test 2" },
  { value: "test 3", label: "test 3" },
];

export const PopUpJurnalUmumContent: React.FC<PopUpUserContentProps> = ({
  data,
  mode,
}) => {
  const [selectedJurnal, setSelectedJurnal] = React.useState("");
  const [selectedAkunPerkiraan, setSelectedAkunPerkiraan] = React.useState("");
  const [kodeAkunValue, setKodeAkunValue] = React.useState("");
  const [namaAkunValue, setNamaAkunValue] = React.useState("");
  const [debitValue, setDebitValue] = React.useState("");
  const [kreditValue, setKreditValue] = React.useState("");
  const [tanggalValue, setTanggalValue] = React.useState("");
  const [buktiValue, setBuktiValue] = React.useState("");
  const [deskripsiValue, setDeskripsiValue] = React.useState("");

  React.useEffect(() => {
    if (mode === "edit" && data) {
      setNamaAkunValue(data.namaAkun || "");
      setSelectedJurnal(data.jurnal || "");
      setSelectedAkunPerkiraan(data.akunPerkiraan || "");
      setDebitValue(data.debit?.toString() || ""); // 👈 convert to string
      setKreditValue(data.kredit?.toString() || "");
      setTanggalValue(data.tanggal || "");
      setBuktiValue(data.bukti || "");
      setDeskripsiValue(data.deskripsi || "");
    }
  }, [data, mode]);

  return (
    <div className={styles.container}>
      <div className={styles.titleField}>
        <Typography className={styles.titleText}>Informasi Umum</Typography>
      </div>
      <div className={styles.container}>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Kode Akun</Typography>
          <FieldText
            label="Kode Akun"
            value={kodeAkunValue}
            onChange={(e) => setKodeAkunValue(e.target.value)}
          />
        </div>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Nama Akun</Typography>
          <FieldText
            label="Nama Akun"
            value={namaAkunValue}
            onChange={(e) => setNamaAkunValue(e.target.value)}
          />
        </div>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Jurnal</Typography>
          <SelectedTextField
            label="Jurnal"
            options={accountType}
            value={selectedJurnal}
            onChange={(e) => setSelectedJurnal(e.target.value)}
          />
        </div>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Akun Perkiraan</Typography>
          <SelectedTextField
            label="Akun Perkiraan"
            options={accountType}
            value={selectedAkunPerkiraan}
            onChange={(e) => setSelectedAkunPerkiraan(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.titleField}>
        <Typography className={styles.titleText}>Saldo</Typography>
      </div>
      <div className={styles.container}>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Debit</Typography>
          <FieldText
            label="Debit"
            value={debitValue}
            onChange={(e) => setDebitValue(e.target.value)}
          />
        </div>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Kredit</Typography>
          <FieldText
            label="Kredit"
            value={kreditValue}
            onChange={(e) => setKreditValue(e.target.value)}
          />
        </div>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Tanggal</Typography>
          <DatePickerField
            value={tanggalValue}
            onChange={(e) => setTanggalValue(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.titleField}>
        <Typography className={styles.titleText}>Lain-Lain</Typography>
      </div>
      <div className={styles.container}>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Bukti</Typography>
          <FieldText
            label="Bukti"
            value={buktiValue}
            onChange={(e) => setBuktiValue(e.target.value)}
          />
        </div>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Deskripsi</Typography>
          <AreaText
            label="Deskripsi"
            value={deskripsiValue}
            onChange={(e) => setDeskripsiValue(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
