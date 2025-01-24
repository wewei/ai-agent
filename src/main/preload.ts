import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  sendChatCompletionStream: (payload: any) => ipcRenderer.invoke('chat:completion-stream', payload),
  onChatChunk: (callback: (chunk: string) => void) => {
    const handler = (_event: any, chunk: string) => callback(chunk);
    ipcRenderer.on('chat:chunk', handler);
    return () => ipcRenderer.removeListener('chat:chunk', handler);
  },
  onChatDone: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on('chat:done', handler);
    return () => ipcRenderer.removeListener('chat:done', handler);
  },
  onChatError: (callback: (error: string) => void) => {
    const handler = (_event: any, error: string) => callback(error);
    ipcRenderer.on('chat:error', handler);
    return () => ipcRenderer.removeListener('chat:error', handler);
  },
  sendChatCompletion: (payload: any) => ipcRenderer.invoke('chat:completion', payload),
}); 