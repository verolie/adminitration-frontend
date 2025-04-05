"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Autocomplete, TextField, Button } from "@mui/material";
import styles from "./styles.module.css";
import { useAppContext } from "@/context/context";

const mockCompanies = ["Company A", "Company B", "Company C", "Company D"];

function ChooseCompany() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState<string | null>(null);

  const { updateSettings, showAlert } = useAppContext();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!company) {
      showAlert("Please select a company");
      return;
    }

    setIsLoading(true);

    // Simpan company ke context
    updateSettings({ darkTheme: false, selectedCompany: company });

    setTimeout(() => {
      router.push("/");
      setIsLoading(false);
    }, 500);
  };

  const handleCompanyClick = (value: string) => {
    setCompany(value);
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
                options={mockCompanies}
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
                {mockCompanies.map((comp) => (
                  <Button
                    key={comp}
                    variant="outlined"
                    size="small"
                    onClick={() => handleCompanyClick(comp)}
                  >
                    {comp}
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
