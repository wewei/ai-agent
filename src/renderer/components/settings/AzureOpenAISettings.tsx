import React from 'react';
import { TextField } from '@mui/material';
import { AzureOpenAISettings } from '../../store';

interface AzureOpenAISettingsViewProps {
  chatSettings: AzureOpenAISettings;
  updateChatSettings: (settings: AzureOpenAISettings) => void;
}

export const AzureOpenAISettingsView: React.FC<AzureOpenAISettingsViewProps> = ({ chatSettings, updateChatSettings }) => {
  return (
    <>
      <TextField
        margin="dense"
        label="终端地址"
        fullWidth
        value={chatSettings.endpoint}
        onChange={(e) => updateChatSettings({
          ...chatSettings,
          endpoint: e.target.value
        })}
      />
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