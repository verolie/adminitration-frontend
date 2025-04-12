import { TextField } from "@mui/material";
import React from "react";

interface DatePickerFieldProps {
  value: string;
  sx?: object;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  value,
  sx = {},
  onChange,
}) => {
  return (
    <TextField
      type="date"
      value={value}
      onChange={onChange}
      size="small"
      sx={{ width: "40%", ...sx }} // default width 100%, bisa di-override
      InputLabelProps={{ shrink: false }}
    />
  );
};

export default DatePickerField;
