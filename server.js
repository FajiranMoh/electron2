const express = require('express');
const app = express();
const PORT = 8000;

const inventoryData = [
  {
    "id": 1,
    "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    "price": 109.95,
    "description": "Your perfect pack for everyday use and walks in the forest.",
    "category": "men's clothing",
    "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    "rating": { "rate": 3.9, "count": 120 }
  },
  {
    "id": 2,
    "title": "Mens Casual Premium Slim Fit T-Shirts",
    "price": 22.3,
    "description": "Slim-fitting style, contrast raglan long sleeve.",
    "category": "men's clothing",
    "image": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    "rating": { "rate": 4.1, "count": 259 }
  }
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