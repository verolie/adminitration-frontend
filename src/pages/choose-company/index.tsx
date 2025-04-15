"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Autocomplete, TextField, Button } from "@mui/material";
import styles from "./styles.module.css";
import { useAppContext } from "@/context/context";
import { fetchCompany } from "../(first-menu)/Company/function/fetchCompany";
import { CompanyModel } from "../(first-menu)/Company/model/companyModel";

function ChooseCompany() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState<string | null>(null);
  const [companyList, setCompanyList] = useState<CompanyModel[]>([]);
  const { updateSettings, showAlert } = useAppContext();

  useEffect(() => {
    getCompanies();
  }, [showAlert]);

  const getCompanies = async () => {
    const token = localStorage.getItem("token");
    try {
      const result: CompanyModel[] = await fetchCompany({}, token);
      setCompanyList(result);
    } catch (error: any) {
      showAlert(error.message || "Failed to load companies");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!company) {
      showAlert("Please select a company");
      return;
    }

    // Cari ID dari nama yang dipilih
    const selected = companyList.find((c) => c.nama === company);
    if (selected?.id) {
      localStorage.setItem("companyID", selected.id);
    }

    setIsLoading(true);
    updateSettings({ darkTheme: false, selectedCompany: company });

    setTimeout(() => {
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

  return (
    <Box className={styles.container}>
      <div className={styles.loginContainer}>
        <div className={styles.card}>
          <Box className={styles.titleContainer}>
            <h1>Choose Company</h1>
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

            <div>
              <h4>List Company</h4>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
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
