import FieldText from "@/component/textField/fieldText";
import DatePickerField from "@/component/textField/dateAreaText";
import * as React from "react";
import styles from "./styles.module.css";
import Typography from "@mui/material/Typography/Typography";
import Button from "@/component/button/button";
import AreaText from "@/component/textField/areaText";
import SelectedTextField from "@/component/textField/selectedText";

interface DataRow {
  kodePerkiraan: string;
  nama: string;
  saldo: string;
}

export const popUpInfoAcctContent = (data: DataRow, mode: "view" | "edit") => {
  const [saldoValue, setSaldoValue] = React.useState(data.saldo);
  const [tanggalAwalValue, setTanggalAwalValue] = React.useState<string>("");
  const [kodePerkiraanValue, setKodePerkiraanValue] = React.useState(
    data.kodePerkiraan
  );
  const [namaValue, setNamaValue] = React.useState(data.nama);
  const [catatanValue, setCatatanValue] = React.useState("");

  const handleAkunPerkiraanChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setKodePerkiraanValue(event.target.value);
  };

  React.useEffect(() => {
    if (mode === "edit" && data) {
      setSaldoValue(data.saldo);
      setKodePerkiraanValue(data.kodePerkiraan);
      setNamaValue(data.nama);
      // Reset atau isi ulang field lainnya juga kalau perlu
    }
  }, [data, mode]);

  const handleNamaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNamaValue(event.target.value);
  };

  const handleSaldoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSaldoValue(event.target.value);
  };

  const handleTanggalAwalChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTanggalAwalValue(event.target.value);
  };

  const handleCatatanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCatatanValue(event.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleField}>
        <Typography className={styles.titleText}>Informasi Umum</Typography>
      </div>
      <div className={styles.container}>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Kode Perkiraan</Typography>
          <FieldText
            label="Kode Perkiraan"
            value={kodePerkiraanValue}
            onChange={handleAkunPerkiraanChange}
          ></FieldText>
        </div>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Nama</Typography>
          <FieldText
            label="Nama"
            value={namaValue}
            onChange={handleNamaChange}
          ></FieldText>
          <Typography className={styles.infoText}>
            Contoh: BCA a/c XXX-XXX, dll
          </Typography>
        </div>
      </div>
      <div className={styles.titleField}>
        <Typography className={styles.titleText}>Saldo</Typography>
      </div>
      <div className={styles.container}>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Saldo Perkiraan</Typography>
          <FieldText
            label="Saldo"
            value={saldoValue}
            onChange={handleSaldoChange}
          ></FieldText>
        </div>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Tanggal Awal</Typography>
          <DatePickerField
            value={tanggalAwalValue}
            onChange={handleTanggalAwalChange}
          ></DatePickerField>
        </div>
      </div>
      <div className={styles.titleField}>
        <Typography className={styles.titleText}>Lain Lain</Typography>
      </div>
      <div className={styles.container}>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Catatan</Typography>
          <AreaText
            label="Catatan"
            value={catatanValue}
            onChange={handleCatatanChange}
          ></AreaText>
        </div>
      </div>
    </div>
  );
};
