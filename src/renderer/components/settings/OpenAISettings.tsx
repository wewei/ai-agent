import React from 'react';
import { TextField } from '@mui/material';
import { OpenAISettings } from '../../store';

interface OpenAISettingsViewProps {
  chatSettings: OpenAISettings;
  updateChatSettings: (settings: OpenAISettings) => void;
}

export const OpenAISettingsView: React.FC<OpenAISettingsViewProps> = ({ chatSettings, updateChatSettings }) => {
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