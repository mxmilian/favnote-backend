const { json } = require('express');
const app = require('express')();
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const { errorController } = require('./controllers/errorController');

app.use(helmet());
app.use(mongoSanitize());
app.use(morgan('dev'));
app.disable('etag');
app.use(json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log('Welcome');
  next();
});

const notesRouter = require('./routes/notesRoutes');
app.use('/api/v1/notes', notesRouter);
const userRouter = require('./routes/userRoutes');
app.use('/api/v1/users', userRouter);

app.use(errorController);

module.exports = app;
