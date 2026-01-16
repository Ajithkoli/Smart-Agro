const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Basic route
app.get('/', (req, res) => {
    res.send('Smart Agriculture Cloud Platform API is running...');
});

// Routes (to be imported)
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/farms', require('./src/routes/farmRoutes'));
app.use('/api/devices', require('./src/routes/deviceRoutes'));
app.use('/api/readings', require('./src/routes/readingRoutes'));
app.use('/api/iot', require('./src/routes/iotRoutes'));
app.use('/api/recommendations', require('./src/routes/recommendationRoutes'));
app.use('/api/disease', require('./src/routes/diseaseRoutes'));
app.use('/api/crop', require('./src/routes/cropRoutes'));

// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Server Error',
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
