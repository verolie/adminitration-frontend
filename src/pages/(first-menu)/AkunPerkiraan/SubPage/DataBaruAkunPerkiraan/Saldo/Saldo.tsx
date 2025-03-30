import FieldText from "@/component/textField/fieldText";
import { Typography } from "@mui/material";
import styles from "./styles.module.css";
import * as React from "react";
import Button from "@/component/button/button";
import DatePickerField from "@/component/textField/dateAreaText";

export default function Saldo() {
  const [saldoValue, setSaldoValue] = React.useState("");
  const [tanggalAwalValue, setTanggalAwalValue] = React.useState("");

  const handleSaldoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSaldoValue(event.target.value);
  };

  const handleTanggalAwalChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTanggalAwalValue(event.target.value);
  };

  const onSubmit = (status: "active" | "submit") => () => {
    const payload = {
      saldo: saldoValue,
      tanggalAwal: tanggalAwalValue,
      status,
    };

    console.log("Submitting data:", payload);
  };
  return (
    <>
      <div className={styles.container}>
        <Typography className={styles.title}>Saldo Awal</Typography>
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
      </div>
    </>
  );
}
