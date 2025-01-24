import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Paper, 
  CircularProgress,
  Tooltip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage from './ChatMessage';
import { useChatStore } from '../store';
import { createChatCompletionStream, createChatCompletion } from '../utils/openai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatPane: React.FC<{ setTopic: (topic: string) => void }> = ({ setTopic }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const { messages, addMessage, updateMessage, settings, clearMessages } = useChatStore();
  const streamContentRef = useRef('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentTopic, setCurrentTopic] = useState<string>('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // 消息变化时滚动到底部

  // 检测主题变化的函数
  const detectTopicChange = async (userMessage: string) => {
    // 构造主题检测的 prompt
    const prompt = `
      请分析用户的最新消息是否表示话题的转变。如果是新话题，请用一句简短的话概括新话题（不超过15个字），如果是同一话题则返回空字符串。
      只返回主题或空字符串，不要返回其他内容。
      
      最新消息：${userMessage}
      当前主题：${currentTopic}
    `;

    try {
      const response = await createChatCompletion(
        settings.chatSettings,
        [{ role: 'user', content: prompt }]
      );

      if (response) {
        const newTopic = response.trim();
        if (newTopic && newTopic !== currentTopic) {
          setCurrentTopic(newTopic);
          setTopic(newTopic);
        }
      }
      console.log(response);
      
    } catch (error) {
      console.error('主题检测失败:', error);
    }
  };

  const handleClear = () => {
    if (isStreaming) return;
    clearMessages();
  };

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

    // 检测主题变化
    await detectTopicChange(userMessage);

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

      createChatCompletionStream(
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
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      p: 1  // 减小内边距
    }}>
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        mb: 1,  // 减小底部间距
        display: 'flex',
        flexDirection: 'column',
        gap: 1   // 减小消息间距
      }}>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 1,  // 减小内边距
          display: 'flex', 
          gap: 0.5,  // 减小元素间距
          alignItems: 'center',
          position: 'relative'
        }}
      >
        {messages.length > 0 && (
          <Tooltip title="清除聊天记录" placement="top">
            <IconButton
              size="small"
              onClick={handleClear}
              disabled={isStreaming}
              sx={{ position: 'absolute', top: -32, right: 0 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <TextField
          fullWidth
          multiline
          maxRows={4}
          size="small"  // 使用小号输入框
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入消息..."
          variant="outlined"
          disabled={isStreaming}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: '0.9rem',  // 减小字体大小
            }
          }}
        />
        <IconButton 
          size="small"  // 使用小号按钮
          color="primary" 
          onClick={handleSend}
          disabled={!inputMessage.trim() || isStreaming}
        >
          {isStreaming ? 
            <CircularProgress size={20} /> : 
            <SendIcon fontSize="small" />
          }
        </IconButton>
      </Paper>
    </Box>
  );
};

export default ChatPane;
