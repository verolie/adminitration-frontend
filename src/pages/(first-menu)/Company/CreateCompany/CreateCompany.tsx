import * as React from "react";
import styles from "./styles.module.css";
import { Typography } from "@mui/material";
import FieldText from "@/component/textField/fieldText";
import Button from "@/component/button/button";

export default function CreateCompany() {
  const [namaValue, setNamaValue] = React.useState("");

  const handleNamaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNamaValue(event.target.value);
  };

  const onSubmit = (status: "active" | "submit") => () => {
    const payload = {
      nama: namaValue,
      status,
    };

    console.log("Submitting data:", payload);
  };

  return (
    <>
      {
        <div className={styles.container}>
          <div className={styles.titleField}>
            <Typography className={styles.titleText}>Detail Company</Typography>
          </div>
          <div className={styles.container}>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Nama</Typography>
              <FieldText
                label="Nama"
                value={namaValue}
                onChange={handleNamaChange}
              ></FieldText>
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
