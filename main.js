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

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { fork } = require("child_process");
const sql = require("mssql");
const fs = require("fs");

let mainWindow;
let serverProcess = null;
let serverProcess2 = null;
let isServerRunning = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile("index.html");
  mainWindow.setMenuBarVisibility(false);
}

async function createAndImportDatabase(config, databaseName, sqlFilePath) {
  try {
    // Sanitize the database name
    const sanitizedDatabaseName = databaseName.replace(/[^\w]/g, "");

    // Connect to the SQL Server
    const pool = await sql.connect(config);

    // Create a new database
    const createDbQuery = `CREATE DATABASE [${sanitizedDatabaseName}]`;
    await pool
      .request()
      .query(createDbQuery)
      .catch((err) => console.error(err));

    // Switch to the new database and import the SQL file
    const newDbConfig = { ...config, database: sanitizedDatabaseName };
    const newDbPool = await sql.connect(newDbConfig);

    // Read and execute SQL file
    let sqlScript = fs
      .readFileSync(path.resolve(sqlFilePath), "utf8")
      .replace(/^\uFEFF/, "") // Remove BOM
      .replace(/[^\x20-\x7E\r\n]/g, "") // Remove invalid characters
      .replace(/\r\n/g, "\n");

    const commands = sqlScript
      .split(/\bGO\b/i)
      .map((command) => command.trim())
      .filter((command) => command.length > 0);

    // Execute each command separately
    for (const command of commands) {
      try {
        await newDbPool
          .request()
          .query(command)
          .catch((err) => console.error(err));
      } catch (err) {
        console.error(`Error executing command: ${command}`);
        throw err;
      }
    }

    // Close the connections
    await newDbPool.close();
    await pool.close();

    return true;
  } catch (err) {
    console.error("Error:", err.message);
    return false;
  }
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("before-quit", () => {
  if (serverProcess) serverProcess.kill();
});

ipcMain.handle("start-server", async (_, dbConfig) => {
  if (isServerRunning) return { status: "already-running", port: 8000 };

  try {
    const pool = await sql.connect({
      user: dbConfig.user,
      password: dbConfig.password,
      server: dbConfig.server,
      port: parseInt(dbConfig.port),
      options: {
        encrypt: true,
        trustServerCertificate: true,
        instanceName: dbConfig.instance,
      },
    });

    // Check if the database existsssd
    const checkDbQuery = `
      SELECT name
      FROM master.dbo.sysdatabases
      WHERE name = 'NurPimz'
    `;
    const result = await pool.request().query(checkDbQuery);
    if (result.recordset.length === 0) {
      const sqlFilePath = path.join(__dirname, "NurPimz.sql");
      const success = await createAndImportDatabase(
        dbConfig,
        "NurPimz",
        sqlFilePath
      );

      if (success) {
        return new Promise((resolve) => {
          serverProcess = fork(path.join(__dirname, "server.js"), [], {
            env: {
              ...process.env,
              DB_USER: dbConfig.user,
              DB_PASS: dbConfig.password,
              DB_HOST: dbConfig.server,
              DB_PORT: dbConfig.port,
              DB_NAME: dbConfig.database,
              DB_INSTANCE: dbConfig.instance,
            },
          });

          serverProcess2 = fork(path.join(__dirname, "server2.js"), [], {
            env: {
              ...process.env,
              DB_USER: dbConfig.user,
              DB_PASS: dbConfig.password,
              DB_HOST: dbConfig.server,
              DB_PORT: dbConfig.port,
              DB_NAME: "NurPimz",
              DB_INSTANCE: dbConfig.instance,
            },
          });

          serverProcess.on("message", (message) => {
            if (message.status === "started") {
              resolve({ status: "started", port: message.port });
            }
          });

          serverProcess2.on("message", (message) => {
            if (message.status === "started") {
              resolve({ status: "started", port: message.port });
            }
          });

          serverProcess.on("error", (err) =>
            resolve({ status: "error", message: err.message })
          );
          serverProcess2.on("error", (err) =>
            resolve({ status: "error", message: err.message })
          );
          serverProcess.on("exit", (code) =>
            console.log(`Server exited with code ${code}`)
          );
          serverProcess2.on("exit", (code) =>
            console.log(`Server exited with code ${code}`)
          );
        });
      }
    } else {
      return new Promise((resolve) => {
        serverProcess = fork(path.join(__dirname, "server.js"), [], {
          env: {
            ...process.env,
            DB_USER: dbConfig.user,
            DB_PASS: dbConfig.password,
            DB_HOST: dbConfig.server,
            DB_PORT: dbConfig.port,
            DB_NAME: dbConfig.database,
            DB_INSTANCE: dbConfig.instance,
          },
        });

        serverProcess2 = fork(path.join(__dirname, "server2.js"), [], {
          env: {
            ...process.env,
            DB_USER: dbConfig.user,
            DB_PASS: dbConfig.password,
            DB_HOST: dbConfig.server,
            DB_PORT: dbConfig.port,
            DB_NAME: "NurPimz",
            DB_INSTANCE: dbConfig.instance,
          },
        });

        serverProcess.on("message", (message) => {
          if (message.status === "started") {
            resolve({ status: "started", port: message.port });
          }
        });

        serverProcess2.on("message", (message) => {
          if (message.status === "started") {
            resolve({ status: "started", port: message.port });
          }
        });

        serverProcess.on("error", (err) =>
          resolve({ status: "error", message: err.message })
        );
        serverProcess2.on("error", (err) =>
          resolve({ status: "error", message: err.message })
        );
        serverProcess.on("exit", (code) =>
          console.log(`Server exited with code ${code}`)
        );
        serverProcess2.on("exit", (code) =>
          console.log(`Server exited with code ${code}`)
        );
      });
    }
  } catch (error) {
    console.log("ERROR", error);
  }
});

// ipcMain.handle('start-server', async (_, dbConfig) => {
//   if (isServerRunning) return { status: 'already-running', port: 8000 };

//   return new Promise((resolve) => {
//     serverProcess = fork(path.join(__dirname, 'server.js'), [], {
//       env: {
//         ...process.env,
//         DB_USER: dbConfig.user,
//         DB_PASS: dbConfig.password,
//         DB_HOST: dbConfig.server,
//         DB_PORT: dbConfig.port,
//         DB_NAME: dbConfig.database,
//         DB_INSTANCE: dbConfig.instance
//       }
//     });

//     serverProcess.on('message', (message) => {
//       if (message.status === 'started') {
//         resolve({ status: 'started', port: message.port });
//       }
//     });

//     serverProcess.on('error', (err) => resolve({ status: 'error', message: err.message }));
//     serverProcess.on('exit', (code) => console.log(`Server exited with code ${code}`));

//   });
// });

// ipcMain.handle("start-server", async (_, dbConfig) => {
//   if (isServerRunning) return { status: "already-running", port: 8000 };

//   try {
//     // Create a connection to the SQL Server
//     const pool = await sql.connect({
//       user: dbConfig.user,
//       password: dbConfig.password,
//       server: dbConfig.server,
//       port: parseInt(dbConfig.port),
//       options: {
//         encrypt: true,
//         trustServerCertificate: true,
//         instanceName: dbConfig.instance,
//       },
//     });

//     // Check if the database exists
//     const checkDbQuery = `
//       SELECT name
//       FROM master.dbo.sysdatabases
//       WHERE name = 'NurPimz'
//     `;
//     const result = await pool.request().query(checkDbQuery);

//     console.log("RESULT", result);

//     if (result.recordset.length === 0) {
//       // Database does not exist, create it using the SQL file
//       const sqlFilePath = path.join(__dirname, "NurPimz.sql");
//       const sqlScript = fs.readFileSync(sqlFilePath, "utf-8");
//       await pool.request().batch(sqlScript);
//       console.log(`Database '${dbConfig.database}' created successfully.`);
//     } else {
//       console.log(`Database '${dbConfig.database}' already exists.`);
//     }
//   } catch (error) {
//     console.error("Database setup error:", error.message);
//     return { status: "error", message: error.message };
//   }

//   // Start the server process
//   // return new Promise((resolve) => {
//   //   serverProcess = fork(path.join(__dirname, 'server.js'), [], {
//   //     env: {
//   //       ...process.env,
//   //       DB_USER: dbConfig.user,
//   //       DB_PASS: dbConfig.password,
//   //       DB_HOST: dbConfig.server,
//   //       DB_PORT: dbConfig.port,
//   //       DB_NAME: dbConfig.database,
//   //       DB_INSTANCE: dbConfig.instance,
//   //     },
//   //   });

//   //   serverProcess.on('message', (message) => {
//   //     if (message.status === 'started') {
//   //       resolve({ status: 'started', port: message.port });
//   //     }
//   //   });

//   //   serverProcess.on('error', (err) => resolve({ status: 'error', message: err.message }));
//   //   serverProcess.on('exit', (code) => console.log(`Server exited with code ${code}`));
//   // });
// });
