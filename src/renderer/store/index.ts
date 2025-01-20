import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Message } from '../components/ChatMessage';

export type Settings = {
  chatSettings: ChatSettings;
}

export type ChatSettings = {
  openAISettings: OpenAISettings;
  azureOpenAISettings: AzureOpenAISettings;
  deepseekSettings: DeepseekSettings;
  provider: 'openAI' | 'azureOpenAI' | 'deepseek';
}

export type OpenAISettings = {
  apiKey: string;
  model: string;
};

export type AzureOpenAISettings = {
  endpoint: string;
  apiKey: string;
  model: string;
};

export type DeepseekSettings = {
  apiKey: string;
  model: string;
};

export interface ChatState {
  messages: Message[];
  settings: Settings;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, content: string) => void;
  clearMessages: () => void;
  updateSettings: (settings: Settings) => void;
}

export const useChatStore = create<ChatState>()(
  persist((set) => ({
    messages: [],
    settings: {
      chatSettings: {
        provider: 'openAI',
        openAISettings: {
          apiKey: '',
          model: 'gpt-3.5-turbo'
        },
        azureOpenAISettings: {
          endpoint: '',
          apiKey: '',
          model: 'gpt-3.5-turbo'
        },
        deepseekSettings: {
          apiKey: '',
          model: 'gpt-3.5-turbo'
        }
      }
    },
    addMessage: (message: Message) => {
      set((state) => ({
        messages: [...state.messages, message]
      }));
    },
    updateMessage: (id: string, content: string) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === id ? { ...msg, content } : msg
        )
      }));
    },
    clearMessages: () => {
      set(() => ({
        messages: []
      }));
    },
    updateSettings: (settings: Settings) => {
      set(() => ({
        settings
      }));
    }
  }), {
    name: 'chat-store',
    storage: createJSONStorage(() => localStorage),
  })
);
