import React from 'react';
import {
  FormControl,
  InputLabel,
  TextField,
  Box
} from '@mui/material';
import { SearchSettings } from '../../store';

interface SearchSettingsViewProps {
  searchSettings: SearchSettings;
  updateSearchSettings: (settings: SearchSettings) => void;
}

export const SearchSettingsView: React.FC<SearchSettingsViewProps> = ({
  searchSettings,
  updateSearchSettings
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <TextField
          label="Bing API Key"
          type="password"
          value={searchSettings.bingSettings.apiKey}
          onChange={(e) =>
            updateSearchSettings({
              ...searchSettings,
              bingSettings: {
                ...searchSettings.bingSettings,
                apiKey: e.target.value
              }
            })
          }
        />
      </FormControl>
    </Box>
  );
};
