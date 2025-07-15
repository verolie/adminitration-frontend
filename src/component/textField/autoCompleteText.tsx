import React from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
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
  size?: "small" | "medium" | "large" | "free";
  onScrollEnd?: () => void;
  isLoading?: boolean;
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
  onScrollEnd,
  isLoading = false,
}) => {
  const width = getWidthFromSize(size);

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const listboxNode = event.currentTarget;
    
    if (
      onScrollEnd &&
      listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 50
    ) {
      onScrollEnd();
    }
  };

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
      ListboxProps={{
        onScroll: handleScroll,
        style: { maxHeight: '300px' }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={label}
          className={styles.customTextField}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};

export default AutocompleteTextField;
