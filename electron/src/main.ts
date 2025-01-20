import { app, BrowserWindow } from 'electron';
import path from 'path';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
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