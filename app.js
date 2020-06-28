const app = require('express')();
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

app.use(helmet());
app.use(mongoSanitize());
app.use(morgan('dev'));


app.use((req, res, next) => {
  console.log('Welcome');
  next();
})

module.exports = app;

