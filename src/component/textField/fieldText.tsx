import { TextField } from "@mui/material";
import React from "react";
import styles from "./styles.module.css";

interface FieldText {
  label: string;
  value: string;
  sx?: object;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomTextField: React.FC<FieldText> = ({
  label,
  value,
  sx,
  onChange,
}) => {
  return (
    <TextField
      placeholder={label}
      value={value}
      onChange={onChange}
      size="small"
      className={styles.customTextField}
      sx={sx}
      // InputLabelProps={{ shrink: false }}
    />
  );
};

export default CustomTextField;
