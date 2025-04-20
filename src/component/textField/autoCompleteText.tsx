import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import styles from "./styles.module.css";

export interface OptionType {
  label: string;
  value: string;
}

interface AutocompleteFieldProps {
  label: string;
  value: OptionType | undefined;
  options: OptionType[];
  onChange: (value: OptionType | undefined) => void;
  disabled?: boolean;
  size?: "small" | "medium" | "large" | "free"; // 👈 size mode
}

const getWidthFromSize = (size: "small" | "medium" | "large" | "free") => {
  switch (size) {
    case "small":
      return "15%";
    case "medium":
      return "50%";
    case "large":
      return "100%";
    case "free":
    default:
      return undefined;
  }
};

const AutocompleteTextField: React.FC<AutocompleteFieldProps> = ({
  label,
  value,
  options,
  onChange,
  disabled = false,
  size = "free",
}) => {
  const width = getWidthFromSize(size);

  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      getOptionLabel={(option) => option.label}
      disableClearable
      size="small"
      disabled={disabled}
      sx={width ? { width } : undefined}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={label}
          className={styles.customTextField}
        />
      )}
    />
  );
};

export default AutocompleteTextField;
