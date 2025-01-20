import React, { useState, useRef } from 'react';
import { Box, TextField, IconButton, Paper, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage from './ChatMessage';
import { useChatStore } from '../store';
import { createChatCompletion } from '../utils/openai';

const ChatPane: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const { messages, addMessage, updateMessage, settings } = useChatStore();
  const streamContentRef = useRef('');

  const handleSend = async () => {
    if (!inputMessage.trim() || isStreaming) return;

    const userMessageId = uuidv4();
    const assistantMessageId = uuidv4();
    const userMessage = inputMessage;
    
    // 重置流内容
    streamContentRef.current = '';
    
    // 添加用户消息
    addMessage({
      id: userMessageId,
      content: userMessage,
      isUser: true,
      timestamp: new Date()
    });

    // 添加助手消息（初始为空）
    addMessage({
      id: assistantMessageId,
      content: '',
      isUser: false,
      timestamp: new Date()
    });

    setInputMessage('');
    setIsStreaming(true);

    try {
      const chatMessages = messages.map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      createChatCompletion(
        settings.chatSettings,
        [...chatMessages, { role: 'user' as const, content: userMessage }],
        (chunk) => {
          streamContentRef.current += chunk;
          updateMessage(assistantMessageId, streamContentRef.current);
        },
        () => {
          setIsStreaming(false);
        },
        (error) => {
          console.error('发送消息失败:', error);
          updateMessage(assistantMessageId, `错误: ${error}`);
          setIsStreaming(false);
        }
      );
    } catch (error) {
      console.error('发送消息失败:', error);
      updateMessage(assistantMessageId, `错误: ${error}`);
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
      <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </Box>
      <Paper elevation={3} sx={{ p: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入消息..."
          variant="outlined"
          disabled={isStreaming}
        />
        <IconButton 
          color="primary" 
          onClick={handleSend}
          disabled={!inputMessage.trim() || isStreaming}
        >
          {isStreaming ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Paper>
    </Box>
  );
};

export default ChatPane;
