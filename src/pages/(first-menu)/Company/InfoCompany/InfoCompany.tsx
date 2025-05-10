import * as React from "react";
import styles from "./styles.module.css";
import { Typography } from "@mui/material";
import FieldText from "@/component/textField/fieldText";
import Button from "@/component/button/button";
import { fetchOneCompany } from "../function/fetchOneCompany";
import { createCompany } from "../function/createCompany";
import { AlertBox } from "@/component/alertBox/alertBox";
import { editCompany } from "../function/editCompany";
import { CompanyModel } from "../model/companyModel";

export default function InfoCompany() {
  const [namaValue, setNamaValue] = React.useState("");
  const [alertMessage, setAlertMessage] = React.useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const handleNamaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNamaValue(event.target.value);
  };

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("companyID");

    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const result = await fetchOneCompany({}, token, companyId); // kalau perlu filter, bisa kirim object
      setNamaValue(result.nama);
    } catch (err) {
      console.error("Gagal fetch company:", err);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = (status: "active" | "submit") => async () => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("companyID");

    if (!token) {
      setAlertMessage({
        message: "Token not found. Please log in again.",
        type: "error",
      });
      return;
    }

    if (!companyId) {
      setAlertMessage({
        message: "Company ID not found.",
        type: "error",
      });
      return;
    }

    const payload: CompanyModel = {
      id: companyId,
      nama: namaValue,
    };

    try {
      const result = await editCompany(payload, token);
      console.log("Edit Success:", result);

      setAlertMessage({
        message: "Company successfully updated!",
        type: "success",
      });

      // onClose(); // uncomment kalau mau langsung tutup tab
    } catch (error: any) {
      setAlertMessage({
        message: error.message || "Failed to update company.",
        type: "error",
      });
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.scrollContent}>
          <div className={styles.titleField}>
            <Typography className={styles.titleText}>Detail Company</Typography>
          </div>
          <div className={styles.fieldContainer}>
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
          </div>
        </div>
      </div>
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
