import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, alpha, useTheme, useMediaQuery } from '@mui/material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // 900px

  // 当窗口大小改变时，如果从桌面切换到移动端，关闭侧边栏
  useEffect(() => {
    if (isMobile && isSidepaneOpen) {
      setIsSidepaneOpen(false);
    }
  }, [isMobile]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.8),
          backdropFilter: 'blur(8px)',
          zIndex: theme.zIndex.drawer + 1,
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
        position: 'relative',
      }}>
        <Box sx={{ 
          width: !isMobile && isSidepaneOpen ? CHAT_PANE_WIDTH : '100%',
          flexShrink: 0,
          transition: 'width 0.3s ease',
          borderRight: 1,
          borderColor: 'divider',
        }}>
          {children}
        </Box>
        <Box sx={{
          position: isMobile ? 'fixed' : 'relative',
          width: isMobile ? '100%' : 'auto',
          height: isMobile ? '100%' : 'auto',
          right: isMobile ? (isSidepaneOpen ? 0 : '-100%') : 'auto',
          top: isMobile ? 0 : 'auto',
          bottom: 0,
          flexGrow: isMobile ? 0 : 1,
          display: !isMobile ? (isSidepaneOpen ? 'block' : 'none') : 'block',
          bgcolor: 'background.paper',
          overflow: 'auto',
          transition: 'right 0.3s ease',
          zIndex: theme.zIndex.drawer,
          boxShadow: isMobile ? theme.shadows[8] : 'none',
          borderLeft: isMobile ? 0 : 1,
          borderColor: 'divider',
        }}>
          {/* 移动端时添加顶部工具栏 */}
          {isMobile && (
            <Box sx={{ 
              p: 1, 
              borderBottom: 1, 
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: 'background.paper',
            }}>
              <Typography variant="subtitle2">
                详细信息
              </Typography>
              <IconButton
                size="small"
                onClick={() => setIsSidepaneOpen(false)}
              >
                <MenuIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
          <Box sx={{ p: 1 }}>
            侧边栏内容
          </Box>
        </Box>
        {/* 移动端时的遮罩层 */}
        {isMobile && isSidepaneOpen && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              zIndex: theme.zIndex.drawer - 1,
            }}
            onClick={() => setIsSidepaneOpen(false)}
          />
        )}
      </Box>
    </Box>
  );
};

export default Layout; 