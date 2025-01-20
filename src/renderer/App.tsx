import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Layout from './components/Layout';
import ChatMessage from './components/ChatMessage';
import SettingsDialog from './components/SettingsDialog';
import { useChatStore } from './store';
import ChatPane from './components/ChatPane';

const App: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <Layout onOpenSettings={handleOpenSettings}>
      <ChatPane />
      <SettingsDialog 
        open={isSettingsOpen}
        onClose={handleCloseSettings}
      />
    </Layout>
  );
};

export default App; 