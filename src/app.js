const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const roomRoutes = require('./api/rooms/routes/roomRoutes');
const authRoutes = require('./api/auth/routes/authRoutes');

const { errorHandler } = require('./middleware/errorHandler');

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://cp-frontend-9ti0.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/room-auth', authRoutes);


// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;