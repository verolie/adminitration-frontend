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
  const [npwpValue, setNpwpValue] = React.useState("");
  const [nikValue, setNikValue] = React.useState("");
  const [nitkuValue, setNitkuValue] = React.useState("");
  const [teleponValue, setTeleponValue] = React.useState("");
  const [emailValue, setEmailValue] = React.useState("");
  const { showAlert } = useAlert();

  const handleNamaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNamaValue(event.target.value);
  };

  const handleNpwpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNpwpValue(event.target.value);
  };

  const handleNikChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNikValue(event.target.value);
  };

  const handleNitkuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNitkuValue(event.target.value);
  };

  const handleTeleponChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeleponValue(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(event.target.value);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert("Please enter a valid email address", "error");
      return false;
    }
    return true;
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9+\-\s()]*$/;
    if (!phoneRegex.test(phone)) {
      showAlert("Please enter a valid phone number", "error");
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
      setNamaValue(result.nama || '');
      setNpwpValue(result.npwp || '');
      setNikValue(result.nik || '');
      setNitkuValue(result.nitku || '');
      setTeleponValue(result.telepon || '');
      setEmailValue(result.email || '');
    } catch (err) {
      console.error("Failed to fetch company:", err);
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

    if (!namaValue.trim()) {
      showAlert("Company name cannot be empty", "error");
      return;
    }

    if (!npwpValue.trim()) {
      showAlert("NPWP cannot be empty", "error");
      return;
    }

    if (!nikValue.trim()) {
      showAlert("NIK cannot be empty", "error");
      return;
    }

    if (!nitkuValue.trim()) {
      showAlert("NITKU cannot be empty", "error");
      return;
    }

    if (!validatePhone(teleponValue)) {
      return;
    }

    if (!validateEmail(emailValue)) {
      return;
    }

    const payload: CompanyModel = {
      id: companyId,
      nama: namaValue.trim(),
      npwp: npwpValue,
      nik: nikValue,
      nitku: nitkuValue,
      telepon: teleponValue.trim(),
      email: emailValue.trim()
    };

    try {
      const result = await editCompany(payload, token);
      
      if (result.success) {
        showAlert("Company successfully updated!", "success");
      } else {
        showAlert(result.message || "Failed to update company.", "error");
      }
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
              />
            </div>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>NPWP</Typography>
              <FieldText
                label="NPWP"
                value={npwpValue}
                onChange={handleNpwpChange}
              />
            </div>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>NIK</Typography>
              <FieldText
                label="NIK"
                value={nikValue}
                onChange={handleNikChange}
              />
            </div>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>NITKU</Typography>
              <FieldText
                label="NITKU"
                value={nitkuValue}
                onChange={handleNitkuChange}
              />
            </div>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Phone Number</Typography>
              <FieldText
                label="Phone Number"
                value={teleponValue}
                onChange={handleTeleponChange}
              />
            </div>
            <div className={styles.inputField}>
              <Typography className={styles.labelText}>Email</Typography>
              <FieldText
                label="Email"
                value={emailValue}
                onChange={handleEmailChange}
                type="email"
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
          </div>
        </div>
      </div>
    </>
  );
}
