require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const carRoutes = require('./routes/carRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const app = express();
const connectDB = require('./config/db'); // Import connectDB function
const cors = require('cors');

// Cấu hình CORS để cho phép frontend trên localhost:3000 truy cập
// app.use(cors({
//   origin: 'http://localhost:3000', // Cấu hình cho phép frontend từ localhost:3000
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));
app.use(cors());

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/cars', carRoutes);

// Route for "Hello World"
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bike-rental')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });


// Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
