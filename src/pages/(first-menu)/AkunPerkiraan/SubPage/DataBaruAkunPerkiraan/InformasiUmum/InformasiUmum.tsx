import FieldText from "@/component/textField/fieldText";
import { Typography } from "@mui/material";
import styles from "./styles.module.css";
import * as React from "react";
import SelectedTextField from "@/component/textField/selectedText";
import Button from "@/component/button/button";

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

export default function InformasiUmum() {
  const [selectedAcctType, setSelectedAcctType] = React.useState("");
  const [kodePerkiraanValue, setKodePerkiraanValue] = React.useState("");
  const [namaValue, setNamaValue] = React.useState("");

  const handleAkunPerkiraanChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setKodePerkiraanValue(event.target.value);
  };

  const handleNamaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNamaValue(event.target.value);
  };

  const onSubmit = (status: "active" | "submit") => () => {
    const payload = {
      accountType: selectedAcctType,
      kodePerkiraan: kodePerkiraanValue,
      nama: namaValue,
      status,
    };

    console.log("Submitting data:", payload);

    // Simpan ke backend atau lakukan tindakan lainnya
    // fetch("/api/saveData", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(payload),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("Response:", data);
    //     alert(`Data berhasil disimpan dengan status: ${status}`);
    //   })
    //   .catch((error) => {
    //     console.error("Error saving data:", error);
    //     alert("Gagal menyimpan data");
    //   });
  };

  return (
    <>
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
    </>
  );
}
