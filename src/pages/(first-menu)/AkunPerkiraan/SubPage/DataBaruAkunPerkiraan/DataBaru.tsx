import * as React from "react";
import styles from "./styles.module.css";
import { Typography } from "@mui/material";
import SelectedTextField from "@/component/textField/selectedText";
import FieldText from "@/component/textField/fieldText";
import Button from "@/component/button/button";
import DatePickerField from "@/component/textField/dateAreaText";
import AreaText from "@/component/textField/areaText";

const accountType = [
  {
    value: "test 1",
    label: "test 1",
  },
  {
    value: "test 2",
    label: "test 2",
  },
  {
    value: "test 3",
    label: "test 3",
  },
];
export default function CreateAkunPerkiraan() {
  const [selectedAcctType, setSelectedAcctType] = React.useState("");
  const [kodePerkiraanValue, setKodePerkiraanValue] = React.useState("");
  const [namaValue, setNamaValue] = React.useState("");
  const [saldoValue, setSaldoValue] = React.useState("");
  const [tanggalAwalValue, setTanggalAwalValue] = React.useState("");
  const [catatanValue, setCatatanValue] = React.useState("");

  const handleAkunPerkiraanChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setKodePerkiraanValue(event.target.value);
  };

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

  const onSubmit = (status: "active" | "submit") => () => {
    const payload = {
      accountType: selectedAcctType,
      kodePerkiraan: kodePerkiraanValue,
      nama: namaValue,
      saldo: saldoValue,
      tanggalAwal: tanggalAwalValue,
      status,
    };

    console.log("Submitting data:", payload);
  };

  return (
    <>
      {
        <div className={styles.container}>
          <div className={styles.titleField}>
            <Typography className={styles.titleText}>Informasi Umum</Typography>
          </div>
          <div className={styles.container}>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Tipe Akun</Typography>
              <SelectedTextField
                label="Tipe Akun"
                options={accountType}
                value={selectedAcctType}
                onChange={(e) => setSelectedAcctType(e.target.value)}
              />
            </div>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>
                Kode Perkiraan
              </Typography>
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
              <Typography className={styles.labelText}>
                Saldo Perkiraan
              </Typography>
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
      }
    </>
  );
}
