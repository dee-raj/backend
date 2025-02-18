const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

const userRoute = require('./routes/users');
const authRoute = require('./routes/authentication');
const postRoute = require('./routes/posts');

const app = express();
dotenv.config();

const getConnection = async () => {
   try {
      const conn = await mongoose.connect(process.env.MONGO_URL);
      if (conn) {
         console.log(`MongoDB Connected on ${conn.connection.host}`);
      } else {
         console.log(`Failed to connect with DB`);
      }
   } catch (error) {
      console.log(`Failed with error... ${error.message}`);
   }
};
getConnection();
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute)


const port = process.env.PORT || 8800
app.listen(port, () => {
   console.log(`Backend server is running!... on port ${port}`);
});