import { TextField } from "@mui/material";
import React from "react";
import styles from "./styles.module.css";

interface DatePickerFieldProps {
  value: string;
  sx?: object;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  value,
  sx,
  onChange,
}) => {
  return (
    <TextField
      type="date"
      value={value}
      onChange={onChange}
      size="small"
      sx={sx}
      className={styles.customTextField}
      InputLabelProps={{ shrink: false }} // Biar label tidak tumpang tindih
    />
  );
};

export default DatePickerField;
