import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton
} from "@mui/material";
import Button from "../button/button";
import { Close, Warning, InfoOutlined } from "@mui/icons-material";

interface ModalConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: "red" | "blue";
  icon?: React.ReactNode;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmColor = "blue",
  icon,
}) => {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{
      sx: {
        borderRadius: 3,
        boxShadow: 6,
        p: 0,
        minWidth: 360,
        background: '#fff',
      }
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 3, pb: 3 }}>
        <Box sx={{
          width: 48, height: 48, borderRadius: '50%',
          background: confirmColor === 'red' ? '#f44336' : '#2196f3',
          display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2
        }}>
          {icon || (
            confirmColor === 'red'
              ? <Warning sx={{ color: 'white', fontSize: 28 }} />
              : <InfoOutlined sx={{ color: 'white', fontSize: 28 }} />
          )}
        </Box>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 700, fontSize: 20, p: 0, mb: 1 }}>{title}</DialogTitle>
        <DialogContent sx={{ textAlign: 'center', color: '#666', fontSize: 15, p: 0, mb: 2 }}>
          <Typography>{description}</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, p: 0 }}>
          <Button onClick={onClose} label={cancelLabel} variant="info" size="large" />
          <Button
            onClick={onConfirm}
            label={confirmLabel}
            variant={confirmColor === 'red' ? 'alert' : 'confirm'}
            size="large"
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ModalConfirm;
