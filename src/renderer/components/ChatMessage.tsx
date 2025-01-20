import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: message.isUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Paper
        sx={{
          maxWidth: '70%',
          p: 2,
          backgroundColor: message.isUser ? 'primary.main' : 'background.paper',
          color: message.isUser ? 'primary.contrastText' : 'text.primary',
        }}
      >
        <Typography variant="body1">{message.content}</Typography>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ChatMessage; 