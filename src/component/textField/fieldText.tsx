import { TextField } from "@mui/material";
import React from "react";
import styles from "./styles.module.css";

interface FieldText {
  label: string;
  value: string;
  sx?: object;
  disabled?: boolean; // Tambahkan ini
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomTextField: React.FC<FieldText> = ({
  label,
  value,
  sx = {},
  disabled = false, // default false
  onChange,
}) => {
  return (
    <TextField
      placeholder={label}
      value={value}
      onChange={onChange}
      size="small"
      disabled={disabled} // Tambahkan ke sini
      className={styles.customTextField}
      sx={{ width: "40%", ...sx }}
    />
  );
};

export default CustomTextField;
