const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const corsOptions = {
  origin: "*",
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization', 'screen'],
  credentials: true
};

app.use(cors(corsOptions));

app.use(cors()); 

const userRoutes = require('./module/route/userRoute');
const bookRoutes = require('./module/route/bookRoute');
const reviewInfoRoutes = require('./module/route/reviewRoute')

// user
app.use('/user', userRoutes);

// book
app.use('/book', bookRoutes);

// review
app.use('/review', reviewInfoRoutes);


app.listen(PORT, ()=>{
  console.log(`Server is running on ${PORT}`)
})
