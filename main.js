// // main.js
// const { app, BrowserWindow, ipcMain } = require('electron');
// const path = require('path');
// const { fork } = require('child_process');

// let mainWindow;
// let serverProcess = null;
// let isServerRunning = false;

// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//       nodeIntegration: false,
//       contextIsolation: true
//     }
//   });

//   mainWindow.loadFile('index.html');
  
//   // Remove menu bar
//   mainWindow.setMenuBarVisibility(false);
// }

// app.whenReady().then(() => {
//   createWindow();

//   app.on('activate', function () {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') app.quit();
// });

// app.on('before-quit', () => {
//   if (serverProcess) {
//     serverProcess.kill();
//   }
// });

// // Handle the start server request from renderer
// ipcMain.handle('start-server', async () => {
//   if (isServerRunning) {
//     return { status: 'already-running', port: 8000 };
//   }
  
//   try {
//     serverProcess = fork(path.join(__dirname, 'server.js'));
//     serverProcess2 = fork(path.join(__dirname, 'server2.js'));
    
//     // Wait for server to start
//     return new Promise((resolve) => {
//       serverProcess.on('message', (message) => {
//         if (message.status === 'started') {
//           isServerRunning = true;
//           resolve({ status: 'started', port: message.port });
//         }
//       });
//       serverProcess2.on('message', (message) => {
//         if (message.status === 'started') {
//           isServerRunning = true;
//           resolve({ status: 'started', port: message.port });
//         }
//       });
      
//       // Handle server errors
//       serverProcess.on('error', (err) => {
//         console.error('Server process error:', err);
//         resolve({ status: 'error', message: err.message });
//       });
//       serverProcess2.on('error', (err) => {
//         console.error('Server process error:', err);
//         resolve({ status: 'error', message: err.message });
//       });
      
//       // Handle server exit
//       serverProcess.on('exit', (code) => {
//         isServerRunning = false;
//         if (code !== 0) {
//           console.log(`Server process exited with code ${code}`);
//         }
//       });
//       serverProcess2.on('exit', (code) => {
//         isServerRunning = false;
//         if (code !== 0) {
//           console.log(`Server process exited with code ${code}`);
//         }
//       });
//     });
//   } catch (error) {
//     console.error('Failed to start server:', error);
//     return { status: 'error', message: error.message };
//   }
// });

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let mainWindow;
let serverProcess = null;
let serverProcess2 = null;
let isServerRunning = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('before-quit', () => {
  if (serverProcess) serverProcess.kill();
});

ipcMain.handle('start-server', async (_, dbConfig) => {
  if (isServerRunning) return { status: 'already-running', port: 8000 };

  return new Promise((resolve) => {
    serverProcess = fork(path.join(__dirname, 'server.js'), [], {
      env: {
        ...process.env,
        DB_USER: dbConfig.user,
        DB_PASS: dbConfig.password,
        DB_HOST: dbConfig.server,
        DB_PORT: dbConfig.port,
        DB_NAME: dbConfig.database,
        DB_INSTANCE: dbConfig.instance
      }
    });

    serverProcess2 = fork(path.join(__dirname, 'server2.js'), [], {
      env: {
        ...process.env,
        DB_USER: dbConfig.user,
        DB_PASS: dbConfig.password,
        DB_HOST: dbConfig.server,
        DB_PORT: dbConfig.port,
        DB_NAME: "NurPimz",
        DB_INSTANCE: dbConfig.instance
      }
    });

    serverProcess.on('message', (message) => {
      if (message.status === 'started') {
        resolve({ status: 'started', port: message.port });
      }
    });

    serverProcess2.on('message', (message) => {
      if (message.status === 'started') {
        resolve({ status: 'started', port: message.port });
      }
    });

    serverProcess.on('error', (err) => resolve({ status: 'error', message: err.message }));
    serverProcess2.on('error', (err) => resolve({ status: 'error', message: err.message }));
    serverProcess.on('exit', (code) => console.log(`Server exited with code ${code}`));
    serverProcess2.on('exit', (code) => console.log(`Server exited with code ${code}`));
  });
});
