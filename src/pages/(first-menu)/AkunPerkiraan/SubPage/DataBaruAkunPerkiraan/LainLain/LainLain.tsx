import FieldText from "@/component/textField/fieldText";
import { Typography } from "@mui/material";
import styles from "./styles.module.css";
import * as React from "react";
import Button from "@/component/button/button";
import DatePickerField from "@/component/textField/dateAreaText";
import AreaText from "@/component/textField/areaText";

export default function LainLain() {
  const [catatanValue, setCatatanValue] = React.useState("");

  const handleCatatanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCatatanValue(event.target.value);
  };

  const onSubmit = (status: "active" | "submit") => () => {
    const payload = {
      saldo: catatanValue,
      status,
    };

    console.log("Submitting data:", payload);
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.inputField}>
          <Typography className={styles.labelText}>Catatan</Typography>
          <AreaText
            label="Catatan"
            value={catatanValue}
            onChange={handleCatatanChange}
          ></AreaText>
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
