import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>设置</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <TextField
            label="API Key"
            type="password"
            fullWidth
            margin="normal"
          />
        </FormControl>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>模型</InputLabel>
          <Select
            label="模型"
            value="gpt-3.5-turbo"
          >
            <MenuItem value="gpt-3.5-turbo">GPT-3.5-Turbo</MenuItem>
            <MenuItem value="gpt-4">GPT-4</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={onClose} variant="contained">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog; 