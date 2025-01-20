import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Layout from './components/Layout';
import ChatMessage, { Message } from './components/ChatMessage';
import SettingsDialog from './components/SettingsDialog';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是 AI 助手，有什么我可以帮你的吗？',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Layout onOpenSettings={() => setSettingsOpen(true)}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        p: 2 
      }}>
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          mb: 2,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </Box>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            display: 'flex',
            gap: 1,
            alignItems: 'center'
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息..."
            variant="outlined"
          />
          <IconButton 
            color="primary" 
            onClick={handleSend}
            disabled={!inputMessage.trim()}
          >
            <SendIcon />
          </IconButton>
        </Paper>
      </Box>
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </Layout>
  );
};

export default App; 