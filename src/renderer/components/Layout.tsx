import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, alpha } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';

interface LayoutProps {
  children: React.ReactNode;
  onOpenSettings: () => void;
  title: string;
}

const CHAT_PANE_WIDTH = 350; // ChatPane 的固定宽度

const Layout: React.FC<LayoutProps> = ({ children, onOpenSettings, title }) => {
  const [isSidepaneOpen, setIsSidepaneOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.8),
          backdropFilter: 'blur(8px)',
        }}
      >
        <Toolbar variant="dense" sx={{ minHeight: 48 }}>
          <Typography 
            variant="subtitle1" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              fontSize: '0.9rem',
            }}
          >
            {title || '新话题'}
          </Typography>
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setIsSidepaneOpen(!isSidepaneOpen)}
            aria-label="toggle sidepane"
            sx={{ mr: 0.5 }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="inherit"
            onClick={onOpenSettings}
            aria-label="settings"
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ 
        display: 'flex', 
        flexGrow: 1, 
        overflow: 'hidden',
      }}>
        <Box sx={{ 
          width: isSidepaneOpen ? CHAT_PANE_WIDTH : '100%',
          flexShrink: 0,
          transition: 'width 0.3s ease',
          borderRight: 1,
          borderColor: 'divider',
        }}>
          {children}
        </Box>
        <Box sx={{
          flexGrow: 1,
          display: isSidepaneOpen ? 'block' : 'none',
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}>
          <Box sx={{ p: 1 }}>
            侧边栏内容
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 