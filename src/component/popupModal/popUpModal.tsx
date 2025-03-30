import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import styles from "./styles.module.css";
import Button from "../button/button";

interface PopupProps<T> {
  open: boolean;
  onClose: () => void;
  data: T | null;
  mode: "view" | "edit";
  renderContent: (data: T) => React.ReactNode;
}

const PopupModal = <T,>({
  open,
  onClose,
  data,
  mode,
  renderContent,
}: PopupProps<T>) => {
  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === "view" ? "Detail Data" : "Edit Data"}</DialogTitle>
      <DialogContent>{renderContent(data)}</DialogContent>
      <DialogActions>
        {mode === "edit" && (
          <>
            <Button
              onClick={onClose}
              label="Save"
              variant="confirm"
              size="large"
            />
            <Button
              onClick={onClose}
              label="Save as draft"
              variant="info"
              size="large"
            />
          </>
        )}
        <Button onClick={onClose} label="Tutup" variant="alert" size="large" />
      </DialogActions>
    </Dialog>
  );
};

export default PopupModal;
