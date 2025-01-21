import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Message } from '../components/ChatMessage';

export type Settings = {
  chatSettings: ChatSettings;
  searchSettings: SearchSettings;
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

export type SearchSettings = {
  bingSettings: BingSettings;
}

export type BingSettings = {
  apiKey: string;
}

// 添加默认值常量
const DEFAULT_SETTINGS: Settings = {
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
  },
  searchSettings: {
    bingSettings: {
      apiKey: ''
    }
  }
};

export const useChatStore = create<ChatState>()(
  persist((set) => ({
    messages: [],
    settings: DEFAULT_SETTINGS,
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
    partialize: (state) => ({ 
      settings: state.settings,
      messages: state.messages.slice(-50)
    }),
    merge: (persistedState: any, currentState) => {
      const mergedSettings = {
        chatSettings: {
          ...DEFAULT_SETTINGS.chatSettings,
          ...persistedState?.settings?.chatSettings,
          openAISettings: {
            ...DEFAULT_SETTINGS.chatSettings.openAISettings,
            ...persistedState?.settings?.chatSettings?.openAISettings,
          },
          azureOpenAISettings: {
            ...DEFAULT_SETTINGS.chatSettings.azureOpenAISettings,
            ...persistedState?.settings?.chatSettings?.azureOpenAISettings,
          },
          deepseekSettings: {
            ...DEFAULT_SETTINGS.chatSettings.deepseekSettings,
            ...persistedState?.settings?.chatSettings?.deepseekSettings,
          },
        },
        searchSettings: {
          bingSettings: {
            ...DEFAULT_SETTINGS.searchSettings.bingSettings,
            ...persistedState?.settings?.searchSettings?.bingSettings,
          }
        }
      };

      return {
        ...currentState,
        messages: persistedState?.messages ?? [],
        settings: mergedSettings,
      };
    },
  })
);
