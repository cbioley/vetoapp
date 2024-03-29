import compression from 'compression';
import esteMiddleware from '../lib/esteMiddleware';
import express from 'express';
import render from './render';

const app = express();

app.use(esteMiddleware());
app.use(compression());

// Note we don't need serve-favicon middleware, it doesn't work with static
// prerendered sites anyway.

// All assets must be handled via require syntax like this:
// <img alt="50x50 placeholder" src={require('./50x50.png')} />
app.use('/assets', express.static('build', { maxAge: '200d' }));
app.use('/google56574e809399bcf2.html', express.static('google56574e809399bcf2.html'));

app.get('*', render);

app.on('mount', () => {
  console.log('App is available at %s', app.mountpath);
});

export default app;
