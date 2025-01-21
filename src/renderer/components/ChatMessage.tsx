import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
          '& pre': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            padding: '8px',
            borderRadius: '4px',
            overflowX: 'auto',
          },
          '& code': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            padding: '2px 4px',
            borderRadius: '4px',
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
          },
        }}
      >
        <Box sx={{ '& > *:last-child': { mb: 0 } }}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => (
                <Typography variant="body1" sx={{ mb: 1 }}>{children}</Typography>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </Box>
        <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ChatMessage; 