import * as React from "react";
import styles from "./styles.module.css";
import { Typography } from "@mui/material";
import FieldText from "@/component/textField/fieldText";
import Button from "@/component/button/button";
import { createCompany } from "../function/createCompany";
import { AlertBox } from "@/component/alertBox/alertBox";

export default function CreateCompany() {
  const [namaValue, setNamaValue] = React.useState("");
  const [alertMessage, setAlertMessage] = React.useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const handleNamaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNamaValue(event.target.value);
  };

  const onSubmit = (status: "active" | "submit") => async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      setAlertMessage({
        message: "Token not found. Please log in again.",
        type: "error",
      });
      return;
    }

    const payload = {
      nama: namaValue,
      // status,
    };

    try {
      const result = await createCompany(payload, token); // asumsi ini return message
      console.log("Submit Success:", result);

      setAlertMessage({
        message: "Company successfully created!",
        type: "success",
      });

      // reset field kalau mau
      setNamaValue("");
    } catch (error: any) {
      console.error("Submit Error:", error.message);

      setAlertMessage({
        message: error.message || "Failed to create company.",
        type: "error",
      });
    }
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
      {alertMessage && (
        <AlertBox
          message={alertMessage.message}
          type={alertMessage.type}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </>
  );
}
