const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();
const { DB_URL, DB_PASSWORD, DB_NAME, PORT } = process.env;

mongoose
  .connect(DB_URL.replace('<password>', DB_PASSWORD).replace('<username>', DB_NAME), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Connected to the DB 😎');
  });

const port = PORT || 2727;

app.listen(port, () => {
  console.log(`Server is listening on ${port} port`);
});
