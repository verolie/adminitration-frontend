"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, TextField } from "@mui/material";
import styles from "./styles.module.css";
import { useAlert } from "@/context/AlertContext";
import { createCompany } from "./function/createCompany";
import { CompanyModel } from "./model/companyModel";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function CreateCompany() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      showAlert("Please enter company name", "error");
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      showAlert("Session expired. Please login again.", "error");
      router.push("/login");
      return;
    }

    try {
      const payload: CompanyModel = {
        nama: companyName.trim()
      };

      await createCompany(payload, token);
      showAlert("Company created successfully!", "success");
      router.push("/choose-company");
    } catch (error: any) {
      showAlert(error.message || "Failed to create company", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className={styles.container}>
      <div className={styles.loginContainer}>
        <div className={styles.card}>
          <Box className={styles.titleContainer}>
            <button 
              className={styles.backButton}
              onClick={() => router.push('/choose-company')}
            >
              <ArrowBackIcon />
            </button>
            <h1>Create Company</h1>
          </Box>

          <Box
            component="form"
            className={styles.inputContainer}
            onSubmit={handleSubmit}
            noValidate
          >
            <div className={styles.fieldInput}>
              <label>Company Name</label>
              <TextField
                fullWidth
                placeholder="Enter company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={styles.inputField}
                disabled={isLoading}
              />
            </div>

            <div className={styles.buttonSubmit}>
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Company"}
              </button>
            </div>
          </Box>
        </div>
      </div>
    </Box>
  );
}

export default CreateCompany; 