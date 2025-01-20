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