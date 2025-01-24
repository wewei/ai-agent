import React, { useState, useEffect, useRef } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, alpha, useTheme, useMediaQuery } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface LayoutProps {
  children: React.ReactNode;
  onOpenSettings: () => void;
  title: string;
}

const CHAT_PANE_WIDTH = 350; // ChatPane 的固定宽度

const Layout: React.FC<LayoutProps> = ({ children, onOpenSettings, title }) => {
  const [isSidepaneOpen, setIsSidepaneOpen] = useState(false);
  const sidepaneRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // 900px

  // 当窗口大小改变时，如果从桌面切换到移动端，关闭侧边栏
  useEffect(() => {
    if (isMobile && isSidepaneOpen) {
      setIsSidepaneOpen(false);
    }
  }, [isMobile]);

  // 处理点击外部关闭 - 仅在移动端时启用
  useEffect(() => {
    if (!isMobile) return; // 仅在移动端时启用点击外部关闭

    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSidepaneOpen &&
        sidepaneRef.current &&
        !sidepaneRef.current.contains(event.target as Node)
      ) {
        setIsSidepaneOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidepaneOpen, isMobile]);

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
          borderRight: !isMobile && isSidepaneOpen ? 1 : 0,
          borderColor: 'divider',
          position: 'relative',
          zIndex: 1,
        }}>
          {children}
        </Box>
        {/* 背景遮罩 - 仅在移动端显示 */}
        {isMobile && isSidepaneOpen && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.3)',
              zIndex: theme.zIndex.drawer - 1,
            }}
          />
        )}
        <Box
          ref={sidepaneRef}
          sx={{
            position: isMobile ? 'fixed' : 'relative',
            height: '100%',
            ...(isMobile ? {
              right: isSidepaneOpen ? 0 : '-85%',
              width: '85%',
            } : {
              flexGrow: 1,
              display: isSidepaneOpen ? 'block' : 'none',
            }),
            top: 0,
            bottom: 0,
            bgcolor: 'background.paper',
            overflow: 'auto',
            transition: 'right 0.3s ease',
            zIndex: theme.zIndex.drawer,
            boxShadow: isMobile ? theme.shadows[8] : 'none',
            borderLeft: 1,
            borderColor: 'divider',
          }}
        >
          {/* 折叠按钮 */}
          {!isMobile && (
            <IconButton
              onClick={() => setIsSidepaneOpen(!isSidepaneOpen)}
              sx={{
                position: 'absolute',
                left: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                borderRadius: '50%',
                width: 40,
                height: 40,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
                zIndex: theme.zIndex.drawer + 1,
              }}
            >
              {isSidepaneOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          )}
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
      </Box>
    </Box>
  );
};

export default Layout; 