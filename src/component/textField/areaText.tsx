import { TextField } from "@mui/material";
import React from "react";

interface TextAreaFieldProps {
  label: string;
  value: string;
  sx?: object;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  sx = {},
  onChange,
}) => {
  return (
    <TextField
      placeholder={label}
      value={value}
      onChange={onChange}
      size="small"
      multiline
      rows={4} // Bisa diubah sesuai kebutuhan
      sx={{ width: "40%", ...sx }}
    />
  );
};

export default TextAreaField;
