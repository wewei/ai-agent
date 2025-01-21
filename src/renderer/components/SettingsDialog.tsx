import React, { useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { ChatSettings, useChatStore } from '../store';
import { OpenAISettingsView } from './settings/OpenAISettings';
import { AzureOpenAISettingsView } from './settings/AzureOpenAISettings';
import { DeepseekSettingsView } from './settings/DeepseekSettings';
import { SearchSettingsView } from './settings/SearchSettingsView';
interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
  const { settings, updateSettings } = useChatStore();

  const handleSave = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>设置</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>AI 提供商</InputLabel>
          <Select
            value={settings.chatSettings.provider || "openAI"}
            label="AI 提供商"
            onChange={(e) =>
              updateSettings({
                ...settings,
                chatSettings: {
                  ...settings.chatSettings,
                  provider: e.target.value as ChatSettings["provider"],
                },
              })
            }
          >
            <MenuItem value="openAI">OpenAI</MenuItem>
            <MenuItem value="azureOpenAI">Azure OpenAI</MenuItem>
            <MenuItem value="deepseek">Deepseek</MenuItem>
          </Select>
        </FormControl>

        {settings.chatSettings.provider === "openAI" && (
          <OpenAISettingsView
            chatSettings={settings.chatSettings.openAISettings}
            updateChatSettings={(openAISettings) => {
              updateSettings({
                ...settings,
                chatSettings: {
                  ...settings.chatSettings,
                  openAISettings,
                },
              });
            }}
          />
        )}

        {settings.chatSettings.provider === "azureOpenAI" && (
          <AzureOpenAISettingsView
            chatSettings={settings.chatSettings.azureOpenAISettings}
            updateChatSettings={(azureOpenAISettings) => {
              updateSettings({
                ...settings,
                chatSettings: {
                  ...settings.chatSettings,
                  azureOpenAISettings,
                },
              });
            }}
          />
        )}

        {settings.chatSettings.provider === "deepseek" && (
          <DeepseekSettingsView
            chatSettings={settings.chatSettings.deepseekSettings}
            updateChatSettings={(deepseekSettings) => {
              updateSettings({
                ...settings,
                chatSettings: {
                  ...settings.chatSettings,
                  deepseekSettings,
                },
              });
            }}
          />
        )}

        <SearchSettingsView
          searchSettings={settings.searchSettings}
          updateSearchSettings={(searchSettings) => {
            updateSettings({
              ...settings,
              searchSettings,
            });
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSave}>保存</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog; 