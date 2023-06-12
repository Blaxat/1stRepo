require("dotenv").config({path: "backend/config.env"});
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/', usersRouter); 

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');

  app.get('/home', (req, res) => {
    const message = 'MongoDB database connection established successfully';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Message</title>
      </head>
      <body>
        <h1>${message}</h1>
      </body>
      </html>
    `;
    res.send(html);
  });
});



