import * as React from "react";
import styles from "./styles.module.css";
import { Typography } from "@mui/material";
import FieldText from "@/component/textField/fieldText";
import Button from "@/component/button/button";
import { AlertBox } from "@/component/alertBox/alertBox";
import { editCompany } from "../function/editCompany"; // ✅ Import editCompany
import { CompanyModel } from "../model/companyModel";

interface EditCompanyProps {
  companyId: string;
  onClose: () => void;
}

export default function EditCompany({ companyId, onClose }: EditCompanyProps) {
  const [namaValue, setNamaValue] = React.useState("");
  const [alertMessage, setAlertMessage] = React.useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const handleNamaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNamaValue(event.target.value);
  };

  // Simulasi ambil data company berdasarkan ID
  React.useEffect(() => {
    const fetchCompany = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAlertMessage({
          message: "Token not found. Please log in again.",
          type: "error",
        });
        return;
      }

      try {
        const response = await fetch(`/api/company/${companyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setNamaValue(data.nama || "");
      } catch (error: any) {
        console.error("Failed to fetch company:", error.message);
        setAlertMessage({
          message: "Failed to load company data.",
          type: "error",
        });
      }
    };

    fetchCompany();
  }, [companyId]);

  const onSubmit = (status: "active" | "submit") => async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAlertMessage({
        message: "Token not found. Please log in again.",
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
            <Typography className={styles.titleText}>Edit Company</Typography>
          </div>
          <div className={styles.fieldContainer}>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Nama</Typography>
              <FieldText
                label="Nama"
                value={namaValue}
                onChange={handleNamaChange}
              />
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
            <Button
              size="large"
              variant="alert"
              label="Close"
              onClick={onClose}
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
