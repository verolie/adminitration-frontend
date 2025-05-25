"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, TextField, CircularProgress, Typography } from "@mui/material";
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
  const [npwp, setNpwp] = useState("");
  const [nik, setNik] = useState("");
  const [nitku, setNitku] = useState("");
  const [telepon, setTelepon] = useState("");
  const [email, setEmail] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9+\-\s()]*$/;
    return phoneRegex.test(phone);
  };

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

    if (!npwp.trim()) {
      showAlert("Please enter NPWP", "error");
      return;
    }

    if (!nik.trim()) {
      showAlert("Please enter NIK", "error");
      return;
    }

    if (!nitku.trim()) {
      showAlert("Please enter NITKU", "error");
      return;
    }

    if (!telepon.trim()) {
      showAlert("Please enter phone number", "error");
      return;
    }

    if (!validatePhone(telepon)) {
      showAlert("Please enter a valid phone number", "error");
      return;
    }

    if (!email.trim()) {
      showAlert("Please enter email", "error");
      return;
    }

    if (!validateEmail(email)) {
      showAlert("Please enter a valid email address", "error");
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
        nama: companyName.trim(),
        npwp: npwp,
        nik: nik,
        nitku: nitku,
        telepon: telepon.trim(),
        email: email.trim()
      };

      const result = await createCompany(payload, token);
      if (result.success) {
        showAlert("Company created successfully!", "success");
        router.push("/choose-company");
      } else {
        showAlert(result.message || "Failed to create company", "error");
      }
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

            <div className={styles.fieldInput}>
              <label>NPWP</label>
              <TextField
                fullWidth
                placeholder="Enter NPWP"
                value={npwp}
                onChange={(e) => setNpwp(e.target.value)}
                className={styles.inputField}
                disabled={isLoading}
              />
            </div>

            <div className={styles.fieldInput}>
              <label>NIK</label>
              <TextField
                fullWidth
                placeholder="Enter NIK"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className={styles.inputField}
                disabled={isLoading}
              />
            </div>

            <div className={styles.fieldInput}>
              <label>NITKU</label>
              <TextField
                fullWidth
                placeholder="Enter NITKU"
                value={nitku}
                onChange={(e) => setNitku(e.target.value)}
                className={styles.inputField}
                disabled={isLoading}
              />
            </div>

            <div className={styles.fieldInput}>
              <label>Phone Number</label>
              <TextField
                fullWidth
                placeholder="Enter phone number"
                value={telepon}
                onChange={(e) => setTelepon(e.target.value)}
                className={styles.inputField}
                disabled={isLoading}
              />
            </div>

            <div className={styles.fieldInput}>
              <label>Email</label>
              <TextField
                fullWidth
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputField}
                disabled={isLoading}
                type="email"
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