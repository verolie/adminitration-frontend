import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Button from "../button/button";

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  message = "Apakah kamu yakin ingin menghapus data ini?",
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Konfirmasi Hapus</DialogTitle>
      <DialogContent>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} label="Batal" variant="info" size="large" />
        <Button
          onClick={onClose}
          label="Confirm"
          variant="confirm"
          size="large"
        />
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteModal;
