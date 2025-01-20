import { ChatSettings } from '../../shared/types';

declare global {
  interface Window {
    electronAPI: {
      sendChatCompletion: (payload: any) => Promise<void>;
      onChatChunk: (callback: (chunk: string) => void) => () => void;
      onChatDone: (callback: () => void) => () => void;
      onChatError: (callback: (error: string) => void) => () => void;
    }
  }
}

export const createChatCompletion = async (
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
    await window.electronAPI.sendChatCompletion({ settings, messages });
  } catch (error) {
    onError(error as string);
    cleanup();
  }

  return cleanup;
};