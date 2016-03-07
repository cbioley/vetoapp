import Firebase from 'firebase';
import Queue from 'firebase-queue';
import Vote from '../common/vetos/Vote';

const createVetosVotesQueue = firebase => new Queue(
  firebase.child('vetos-votes-queue'),
  async (data, progress, resolve, reject) => {
    try {
      const vote = new Vote(data);
      const previousVotePath = vote.yes
        ? `vetos-votes-yes/${vote.id}`
        : `vetos-votes-no/${vote.id}`;
      const previousVote = await firebase.child(previousVotePath).once('value');
      if (previousVote.exists()) {
        resolve();
        return;
      }
      const yesTotalPath = `vetos-votes-yes-total/${vote.vetoId}`;
      const yesTotal = await firebase.child(yesTotalPath).once('value');
      const yesTotalValue = yesTotal.val() || 0;
      await firebase.update({
        // If vetos-votes-yes-total is accidentally deleted, we can stop
        // queue updating, set correct value, then restart it. Easy.
        [yesTotalPath]: yesTotalValue + (vote.yes ? 1 : -1),
        [`vetos-votes-yes/${vote.id}`]: vote.yes ? vote.toJS() : null,
        [`vetos-votes-no/${vote.id}`]: vote.yes ? null : vote.toJS()
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });

export default async function createFirebaseQueue(email, password, url) {
  const firebase = new Firebase(url);
  // TODO: Use authWithToken. Remember authWithPassword has a session timeout.
  await firebase.authWithPassword({ email, password });

  const queues = [
    createVetosVotesQueue(firebase)
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
