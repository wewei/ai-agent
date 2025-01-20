import OpenAI, { AzureOpenAI } from 'openai';
import { ChatSettings } from '../../shared/types';

const OPENAI_API_URL = 'https://api.openai.com';
const DEEPSEEK_API_URL = 'https://api.deepseek.com';

export class OpenAIService {
  private getClient(settings: ChatSettings) {
    const { provider, openAISettings, azureOpenAISettings, deepseekSettings } = settings;
    
    if (provider === 'azureOpenAI') {
      return new AzureOpenAI({ 
        apiKey: azureOpenAISettings.apiKey, 
        endpoint: azureOpenAISettings.endpoint 
      });
    }
    
    if (provider === 'deepseek') {
      return new OpenAI({ 
        apiKey: deepseekSettings.apiKey, 
        baseURL: DEEPSEEK_API_URL 
      });
    }
    
    return new OpenAI({ 
      apiKey: openAISettings.apiKey, 
      baseURL: OPENAI_API_URL 
    });
  }

  async *createChatCompletion(settings: ChatSettings, messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>) {
    const client = this.getClient(settings);
    const model = settings[`${settings.provider}Settings`].model;

    console.log(messages);

    const stream = await client.chat.completions.create({
      model,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      if (chunk.choices[0]?.delta?.content) {
        yield chunk.choices[0].delta.content;
      }
    }
  }
} 