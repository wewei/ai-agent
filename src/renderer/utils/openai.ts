import { ChatSettings } from '../../shared/types';
import openai from 'openai';

declare global {
  interface Window {
    electronAPI: {
      sendChatCompletionStream: (payload: any) => Promise<void>;
      sendChatCompletion: (payload: any) => Promise<openai.ChatCompletion>;
      onChatChunk: (callback: (chunk: string) => void) => () => void;
      onChatDone: (callback: () => void) => () => void;
      onChatError: (callback: (error: string) => void) => () => void;
    }
  }
}

export const createChatCompletionStream = async (
  settings: ChatSettings,
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (error: string) => void
) => {
  const removeChunkListener = window.electronAPI.onChatChunk(onChunk);
  const removeDoneListener = window.electronAPI.onChatDone(() => {
    onDone();
    cleanup();
  });
  const removeErrorListener = window.electronAPI.onChatError((error) => {
    onError(error);
    cleanup();
  });

  const cleanup = () => {
    removeChunkListener();
    removeDoneListener();
    removeErrorListener();
  };

  try {
    await window.electronAPI.sendChatCompletionStream({ settings, messages });
  } catch (error) {
    onError(error as string);
    cleanup();
  }

  return cleanup;
};

export const createChatCompletion = async (
  settings: ChatSettings,
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
): Promise<string | null> => {
  try {
    const response = await window.electronAPI.sendChatCompletion({ settings, messages });
    return response?.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error('Chat completion error:', error);
    return null;
  }
};