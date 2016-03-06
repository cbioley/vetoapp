import config from './config';
import createFirebaseQueue from '../statistics/createFirebaseQueue';
import errorHandler from './lib/errorHandler';
import express from 'express';
import frontend from './frontend';

const app = express();

app.use(frontend);
app.use(errorHandler);

const { port } = config;

app.listen(port, () => {
  console.log('Server started at port %d', port);
});

// TODO: Use config.
const firebaseUrl = 'https://vetoap-dev.firebaseio.com';
createFirebaseQueue(firebaseUrl);
