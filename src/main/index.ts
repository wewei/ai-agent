import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { OpenAIService } from './services/openai';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    console.log('Running in development mode');
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    console.log('Running in production mode');
    const indexPath = path.join(__dirname, '../renderer/index.html');
    mainWindow.loadFile(indexPath).catch(console.error);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const openAIService = new OpenAIService();

ipcMain.handle('chat:completion', async (event, { settings, messages }) => {
  try {
    const stream = openAIService.createChatCompletion(settings, messages);
    for await (const chunk of stream) {
      console.log(chunk);
      event.sender.send('chat:chunk', chunk);
    }
    console.log('chat:done');
    event.sender.send('chat:done');
  } catch (error) {
    console.log('chat:error');
    event.sender.send('chat:error', error);
  }
}); 