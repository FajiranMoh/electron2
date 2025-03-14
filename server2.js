const express = require('express');
const app = express();
const PORT = 9000;

const inventoryData = [
  {
    "id": 1,
    "title": "Fajiran-raman - Foldsack No. 1 Backpack, Fits 15 Laptops",
    "price": 109.95,
    "description": "Your perfect pack for everyday use and walks in the forest.",
    "category": "men's clothing",
    "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    "rating": { "rate": 3.9, "count": 120 }
  },
 
];

app.get('/inventory', (req, res) => {
  res.json(inventoryData);
});

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/inventory`);
  
  // Send message to parent process (Electron)
  if (process.send) {
    process.send({ status: 'started', port: PORT });
  }
});

// Handle process termination
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server shutting down');
  });
});