import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import styles from "./styles.module.css";

interface SelectionCheckboxProps {
  label: string;
  options: { value: string | number; label: string }[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  sx?: object;
  readOnly?: boolean;
}

const SelectionCheckbox: React.FC<SelectionCheckboxProps> = ({
  label,
  options,
  value,
  onChange,
  sx,
  readOnly = false,
}) => {
  const defaultSx = { width: "100%" };
  const mergedSx = { ...defaultSx, ...sx };

  const handleChange = (event: any) => {
    const {
      target: { value: selectedValues },
    } = event;
    
    // Handle both string and array values
    const finalValue = typeof selectedValues === 'string' 
      ? selectedValues.split(',') 
      : selectedValues;
    
    onChange(finalValue);
  };

  return (
    <FormControl size="small" sx={mergedSx}>
      <InputLabel id={`${label}-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-label`}
        id={`${label}-select`}
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => {
          const selectedLabels = options
            .filter(option => selected.includes(option.value))
            .map(option => option.label);
          return selectedLabels.join(', ');
        }}
        disabled={readOnly}
        className={styles.selectedText}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox checked={value.indexOf(option.value) > -1} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectionCheckbox; 