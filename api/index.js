import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport'
import localStrategy from './server/middlewares/local-strategy'
import jwtStrategy from './server/middlewares/jwt-strategy'
import session from 'express-session'
import cookieParser from 'cookie-parser'

import authRoutes from './server/routes/auth';
import userRoutes from './server/routes/user';

require('dotenv').config();

const app = express();
app.use(cors());

app.use(
  bodyParser.json({
    verify: function (req, res, buf) {
      req.rawBody = buf.toString()
    },
  })
)
passport.use(localStrategy)
passport.use(jwtStrategy)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(session({
  secret: 'anything', resave: false, saveUninitialized: false, cookie: { secure: true },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser()) // required before session.

const port = process.env.PORT || 8000;

app.use('/api/v1/', authRoutes);
app.use('/api/v1/', userRoutes);

// when a random route is inputed
app.get('*', (req, res) => res.status(200).send({
  message: 'Endpoint Not Found',
}));

app.listen(port, () => {
  console.log(`Initialized on PORT ${port}`);
});

export default app;
