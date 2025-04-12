import { MenuItem, TextField } from "@mui/material";
import React from "react";
import styles from "./styles.module.css";

interface SelectedTextFieldProps {
  label: string;
  options: { value: string | number; label: string }[];
  value: string | number;
  sx?: object;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SelectedTextField: React.FC<SelectedTextFieldProps> = ({
  label,
  options,
  value,
  sx,
  onChange,
}) => {
  const defaultSx = { width: "40%" };
  const mergedSx = { ...defaultSx, ...sx };

  return (
    <TextField
      select
      label={value ? "" : label}
      value={value}
      onChange={onChange}
      size="small"
      className={styles.selectedText}
      sx={mergedSx}
      InputLabelProps={{ shrink: false }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectedTextField;
