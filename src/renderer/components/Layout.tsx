import React from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

interface LayoutProps {
  children: React.ReactNode;
  onOpenSettings: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onOpenSettings }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Chat Bot
          </Typography>
          <IconButton
            size="large"
            color="inherit"
            onClick={onOpenSettings}
            aria-label="settings"
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 