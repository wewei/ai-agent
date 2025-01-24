import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
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
    <Paper
      elevation={1}
      sx={{
        p: 1,
        bgcolor: message.isUser ? 'primary.50' : 'background.paper',
        maxWidth: '85%',
        alignSelf: message.isUser ? 'flex-end' : 'flex-start',
      }}
    >
      <Box sx={{ 
        '& > *:last-child': { mb: 0 },
        '& p': { 
          m: 0,
          fontSize: '0.9rem',
          lineHeight: 1.4,
        },
        '& pre': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          p: 1,
          borderRadius: 1,
          overflowX: 'auto',
          fontSize: '0.85rem',
          my: 0.5,
        },
        '& code': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          p: '2px 4px',
          borderRadius: 0.5,
          fontSize: '0.85rem',
        },
        '& ul, & ol': {
          m: 0,
          pl: 2.5,
          '& li': {
            fontSize: '0.9rem',
            lineHeight: 1.4,
          }
        },
        '& img': {
          maxWidth: '100%',
          height: 'auto',
          borderRadius: 1,
        },
        '& blockquote': {
          borderLeft: 3,
          borderColor: 'divider',
          m: 0,
          pl: 1,
          py: 0.25,
        },
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          fontSize: '0.95rem',
          fontWeight: 'bold',
          my: 0.5,
        },
        '& table': {
          borderCollapse: 'collapse',
          width: '100%',
          fontSize: '0.85rem',
          '& th, & td': {
            border: 1,
            borderColor: 'divider',
            p: 0.5,
          }
        },
      }}
    >
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <Typography component="p">{children}</Typography>
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" 
               style={{ color: 'inherit', textDecoration: 'underline' }}>
              {children}
            </a>
          ),
        }}
      >
        {message.content}
      </ReactMarkdown>
      <Typography 
        variant="caption" 
        sx={{ 
          display: 'block', 
          mt: 0.5, 
          opacity: 0.7,
          fontSize: '0.75rem',
        }}
      >
        {new Date(message.timestamp).toLocaleTimeString()}
      </Typography>
      </Box>
    </Paper>
  );
};

export default ChatMessage; 