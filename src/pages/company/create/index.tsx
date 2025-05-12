"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, TextField, CircularProgress } from "@mui/material";
import styles from "./styles.module.css";
import { useAlert } from "@/context/AlertContext";
import { createCompany } from "./function/createCompany";
import { CompanyModel } from "./model/companyModel";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getUserData } from "@/utils/function/getUserData";

function CreateCompany() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    const checkUserAccess = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const userData = await getUserData(token);
        
        // If user is an employee, they shouldn't access this page
        if (userData.data.is_employee) {
          showAlert("Employees cannot access this page", "error");
          router.push("/");
          return;
        }
        
        setIsVerifying(false);
      } catch (error: any) {
        showAlert(error.message || "Failed to verify user access", "error");
        router.push("/login");
      }
    };

    checkUserAccess();
  }, [showAlert, router]);

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

  if (isVerifying) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

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