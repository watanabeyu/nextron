import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import {
  createWindow,
  exitOnChange,
} from './helpers';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  exitOnChange();
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('get-base-url', (event) => {
  event.returnValue = isProd ? 'app://./' : 'http://localhost:8888';
});
