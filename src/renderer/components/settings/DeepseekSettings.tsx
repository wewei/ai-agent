import React from 'react';
import { TextField } from '@mui/material';
import { DeepseekSettings } from '../../store';

interface DeepseekSettingsViewProps {
  chatSettings: DeepseekSettings;
  updateChatSettings: (settings: DeepseekSettings) => void;
}

export const DeepseekSettingsView: React.FC<DeepseekSettingsViewProps> = ({ chatSettings, updateChatSettings }) => {
  return (
    <>
      <TextField
        margin="dense"
        label="API Key"
        type="password"
        fullWidth
        value={chatSettings.apiKey}
        onChange={(e) => updateChatSettings({
          ...chatSettings,
          apiKey: e.target.value
        })}
      />
      <TextField
        margin="dense"
        label="模型"
        fullWidth
        value={chatSettings.model}
        onChange={(e) => updateChatSettings({
          ...chatSettings,
          model: e.target.value
        })}
      />
    </>
  );
}; 