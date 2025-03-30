import { TextField } from "@mui/material";
import React from "react";
import styles from "./styles.module.css";

interface TextAreaFieldProps {
  label: string;
  value: string;
  sx?: object;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
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
      multiline
      rows={4} // Bisa diubah sesuai kebutuhan
    />
  );
};

export default TextAreaField;
