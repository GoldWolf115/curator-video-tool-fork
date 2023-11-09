const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
 const cors = require('cors');
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

app.use(cors());
// Define Routes
app.use('/api/members', require('./routes/api/members'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/assignment', require('./routes/api/assignment'));
// app.use('/api/curator-list', require('./routes/api/curatorList'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
