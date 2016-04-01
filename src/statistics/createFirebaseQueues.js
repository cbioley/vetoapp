import Firebase from 'firebase';
import vetosArchiveQueue from './queues/vetosArchiveQueue';
import vetosVotesQueue from './queues/vetosVotesQueue';

export default async function createFirebaseQueues(email, password, url) {
  const firebase = new Firebase(url);
  // TODO: Use authWithToken. Remember authWithPassword has a session timeout.
  await firebase.authWithPassword({ email, password });

  const queues = [
    vetosArchiveQueue(firebase),
    vetosVotesQueue(firebase)
  ];

  // https://github.com/firebase/firebase-queue#graceful-shutdown
  process.on('SIGINT', () => {
    console.log('Starting queue shutdown'); // eslint-disable-line no-console
    const promises = queues.map(queue => queue.shutdown());
    Promise.all(promises).then(() => {
      console.log('Finished queue shutdown'); // eslint-disable-line no-console
      process.exit(0);
    });
  });
}
