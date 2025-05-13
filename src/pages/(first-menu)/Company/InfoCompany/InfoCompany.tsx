import * as React from "react";
import styles from "./styles.module.css";
import { Typography } from "@mui/material";
import FieldText from "@/component/textField/fieldText";
import Button from "@/component/button/button";
import { fetchOneCompany } from "../function/fetchOneCompany";
import { createCompany } from "../function/createCompany";
import { useAlert } from "@/context/AlertContext";
import { editCompany } from "../function/editCompany";
import { CompanyModel } from "../model/companyModel";

export default function InfoCompany() {
  const [namaValue, setNamaValue] = React.useState("");
  const [uniqueIdValue, setUniqueIdValue] = React.useState("");
  const { showAlert } = useAlert();

  const handleNamaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNamaValue(event.target.value);
  };

  const handleUniqueIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUniqueIdValue(value);
  };

  const validateUniqueId = (value: string): boolean => {
    if (value === "") {
      showAlert("ID Perusahaan cannot be empty", "error");
      return false;
    }
    if (value.includes(' ') || value.includes('@')) {
      showAlert("ID Perusahaan cannot contain spaces or @ characters", "error");
      return false;
    }
    return true;
  };

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("companyID");

    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const result = await fetchOneCompany({}, token, companyId);
      setNamaValue(result.nama);
      setUniqueIdValue(result.unique_id || '');
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
      showAlert("Token not found. Please log in again.", "error");
      return;
    }

    if (!companyId) {
      showAlert("Company ID not found.", "error");
      return;
    }

    if (!validateUniqueId(uniqueIdValue)) {
      return;
    }

    const payload: CompanyModel = {
      id: companyId,
      nama: namaValue,
      unique_id: uniqueIdValue,
    };

    try {
      const result = await editCompany(payload, token);
      
      if (result.success) {
        showAlert("Company successfully updated!", "success");
      } else {
        showAlert(result.message || "Failed to update company.", "error");
      }
      // onClose(); // uncomment kalau mau langsung tutup tab
    } catch (error: any) {
      showAlert(error.message || "Failed to update company.", "error");
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
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>ID Perusahaan</Typography>
              <FieldText
                label="ID Perusahaan"
                value={uniqueIdValue}
                onChange={handleUniqueIdChange}
              ></FieldText>
              <Typography 
                className={styles.helperText}
                style={{ 
                  fontSize: '12px', 
                  color: '#666', 
                  marginTop: '4px',
                  fontStyle: 'italic'
                }}
              >
                ID Perusahaan bersifat unik dan akan digunakan untuk login karyawan. Tidak boleh mengandung spasi dan karakter @
              </Typography>
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
    </>
  );
}
