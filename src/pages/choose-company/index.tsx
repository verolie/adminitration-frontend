"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Autocomplete, TextField, Button, Divider, CircularProgress } from "@mui/material";
import styles from "./styles.module.css";
import { useAppContext } from "@/context/context";
import { fetchCompany } from "../../pageTab/Company/function/fetchCompany";
import { CompanyModel } from "../../pageTab/Company/model/companyModel";
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { getUserData } from "@/utils/function/getUserData";
import { useAlert } from "@/context/AlertContext";

function ChooseCompany() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [company, setCompany] = useState<string | null>(null);
  const [companyList, setCompanyList] = useState<CompanyModel[]>([]);
  const { updateSettings } = useAppContext();
  const { showAlert } = useAlert();

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
        
        // If all checks pass, fetch companies
        await getCompanies();
        setIsVerifying(false);
      } catch (error: any) {
        showAlert(error.message || "Failed to verify user access", "error");
        router.push("/login");
      }
    };

    checkUserAccess();
  }, [showAlert]);

  const getCompanies = async () => {
    const token = localStorage.getItem("token");
    try {
      const result: CompanyModel[] = await fetchCompany({}, token);
      setCompanyList(result);
    } catch (error: any) {
      showAlert(error.message || "Failed to load companies", "error");
    }
  };

  const handleLogout = () => {
    // Clear all auth-related data
    localStorage.removeItem("token");
    localStorage.removeItem("companyID");
    // Redirect to login page
    router.push("/login");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!company) {
      showAlert("Please select a company", "error");
      return;
    }

    // Find ID from selected name
    const selected = companyList.find((c) => c.nama === company);
    if (selected?.id) {
      localStorage.setItem("companyID", selected.id);
    }

    setIsLoading(true);
    updateSettings({ darkTheme: false, selectedCompany: company });

    setTimeout(() => {
      showAlert("Company selected successfully", "success");
      router.push("/");
      setIsLoading(false);
    }, 500);
  };

  const handleCompanyClick = (value: string) => {
    setCompany(value);

    const selected = companyList.find((c) => c.nama === value);
    if (selected?.id) {
      localStorage.setItem("companyID", selected.id);
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
            <h1>Choose Company</h1>
            <button 
              className={styles.logoutButton}
              onClick={handleLogout}
              title="Logout"
            >
              <LogoutIcon />
            </button>
          </Box>

          <Box
            component="form"
            className={styles.inputContainer}
            onSubmit={handleSubmit}
            noValidate
          >
            <div className={styles.fieldInput}>
              <label>Company</label>
              <Autocomplete
                freeSolo
                options={companyList.map((c) => c.nama || "Unknown Company")}
                value={company}
                onInputChange={(_, newInputValue) => setCompany(newInputValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search or type company"
                    fullWidth
                  />
                )}
              />
            </div>

            <div className={styles.companyListSection}>
              <div className={styles.companyListHeader}>
                <h4>List Company</h4>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  className={styles.createButton}
                  onClick={() => router.push('/company/create')}
                >
                  Create New Company
                </Button>
              </div>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {companyList.map((comp) => (
                  <Button
                    key={comp.id}
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      handleCompanyClick(comp.nama || "Unknown Company")
                    }
                  >
                    {comp.nama}
                  </Button>
                ))}
              </Box>
            </div>

            <div className={styles.buttonSubmit}>
              <button type="submit" disabled={isLoading}>
                Confirm
              </button>
            </div>
          </Box>
        </div>
      </div>
    </Box>
  );
}

export default ChooseCompany;
