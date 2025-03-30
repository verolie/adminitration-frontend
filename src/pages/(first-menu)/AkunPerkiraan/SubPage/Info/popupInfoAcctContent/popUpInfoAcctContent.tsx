import FieldText from "@/component/textField/fieldText";
import DatePickerField from "@/component/textField/dateAreaText";
import * as React from "react";
import styles from "./styles.module.css";
import Typography from "@mui/material/Typography/Typography";
import Button from "@/component/button/button";

interface DataRow {
  kodePerkiraan: string;
  nama: string;
  tipeAkun: string;
  saldo: string;
}

export const popUpInfoAcctContent = (data: DataRow, mode: "view" | "edit") => {
  const [saldoValue, setSaldoValue] = React.useState(data.saldo);
  const [tanggalAwalValue, setTanggalAwalValue] = React.useState<Date | null>(
    null
  );

  const handleSaldoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSaldoValue(event.target.value);
  };

  const handleTanggalAwalChange = (newDate: Date | null) => {
    setTanggalAwalValue(newDate);
  };

  const onSubmit = (status: "active" | "submit") => () => {
    console.log(`Saving as ${status}`, {
      saldo: saldoValue,
      tanggalAwal: tanggalAwalValue,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.container}>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Saldo Perkiraan</Typography>
          <FieldText
            label="Saldo"
            value={saldoValue}
            onChange={handleSaldoChange}
          />
        </div>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Tanggal Awal</Typography>
          <DatePickerField
            value={
              tanggalAwalValue
                ? tanggalAwalValue.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              handleTanggalAwalChange(
                e.target.value ? new Date(e.target.value) : null
              )
            }
          />
        </div>
      </div>
    </div>
  );
};
