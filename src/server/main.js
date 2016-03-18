import config from './config';
import createFirebaseQueue from '../statistics/createFirebaseQueue';
import errorHandler from './lib/errorHandler';
import express from 'express';
import frontend from './frontend';

const app = express();

app.use(frontend);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log('Server started at port %d', config.port);
});

// TODO: Should be separate service like AWS Lambda.
createFirebaseQueue(
  config.firebaseQueueEmail,
  config.firebaseQueuePassword,
  config.firebaseUrl
);
