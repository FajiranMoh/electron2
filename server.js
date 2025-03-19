// const express = require('express');
// const app = express();
// const PORT = 8000;

// const inventoryData = [
//   {
//     "id": 1,
//     "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
//     "price": 109.95,
//     "description": "Your perfect pack for everyday use and walks in the forest.",
//     "category": "men's clothing",
//     "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
//     "rating": { "rate": 3.9, "count": 120 }
//   },
//   {
//     "id": 2,
//     "title": "Mens Casual Premium Slim Fit T-Shirts",
//     "price": 22.3,
//     "description": "Slim-fitting style, contrast raglan long sleeve.",
//     "category": "men's clothing",
//     "image": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
//     "rating": { "rate": 4.1, "count": 259 }
//   }
// ];

// app.get('/inventory', (req, res) => {
//   res.json(inventoryData);
// });

// const server = app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}/inventory`);
  
//   // Send message to parent process (Electron)
//   if (process.send) {
//     process.send({ status: 'started', port: PORT });
//   }
// });

// // Handle process termination
// process.on('SIGTERM', () => {
//   server.close(() => {
//     console.log('Server shutting down');
//   });
// });

const express = require('express');
const sql = require('mssql');
const app = express();
const PORT = 8000;

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true,
    trustedConnection: true,
    instanceName: process.env.DB_INSTANCE,
    enableArithAbort: true
  },
  port: parseInt(process.env.DB_PORT) || 1433
};

// Connect to MS SQL Server
async function connectToDatabase() {
  try {
    await sql.connect(dbConfig);
    console.log('Connected to the database successfully!');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

connectToDatabase();

app.get('/inventory', async (req, res) => {
  try {
    const result = await sql.query('SELECT TOP 2 * FROM Inventory');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/inventory`);
  if (process.send) process.send({ status: 'started', port: PORT });
});

process.on('SIGTERM', () => {
  server.close(() => console.log('Server shutting down'));
});
