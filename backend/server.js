


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const catRoutes = require('./routes/categories');
const recordRoutes = require('./routes/records');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());
app.use(cors());

//  Basic GET routes
app.get('/', (req, res) => {
  res.send('Welcome to the MERN CRUD API ');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running smoothly ✅' });
});

//  Use your route modules
app.use('/api/auth', authRoutes);
app.use('/api/categories', catRoutes);
app.use('/api/records', recordRoutes);

//  Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

//  Connect to MongoDB and start the server
connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/mern_crud_db')
  .then(() => {
    app.listen(PORT, () => {
      console.log(` Server started at ${BASE_URL}`);
    });
  })
  .catch((err) => {
    console.error(' Database connection failed:', err);
    process.exit(1);
  });
