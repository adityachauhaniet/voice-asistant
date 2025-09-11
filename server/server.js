const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const listRoutes = require('./routes/lists');
const itemRoutes = require('./routes/items');

// Create Express app
const app = express();

// Middleware
app.use(cors({
    origin: "https://voice-asistant.onrender.com"
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopping-assistant', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/items', itemRoutes);

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
