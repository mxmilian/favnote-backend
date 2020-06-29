const app = require('express')();
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

app.use(helmet());
app.use(mongoSanitize());
app.use(morgan('dev'));
app.disable('etag');

app.use((req, res, next) => {
  console.log('Welcome');
  next();
});

const notesRouter = require('./routes/notesRoutes');
app.use('/api/v1/notes', notesRouter);


module.exports = app;
