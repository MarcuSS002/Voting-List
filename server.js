const express = require('express');
const app = express();
require('dotenv').config();
require('./db'); // DB connection

const bodyparser = require('body-parser');
app.use(bodyparser.json());

const PORT = process.env.PORT || 3000;

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

const candidateRoutes = require('./routes/candidateRoute');
app.use('/candidate', candidateRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
