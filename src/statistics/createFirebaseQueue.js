import Firebase from 'firebase';
import Queue from 'firebase-queue';
import Vote from '../common/vetos/Vote';

export default async function createFirebaseQueue(firebaseUrl, firebaseQueuePass) {
  const firebase = new Firebase(firebaseUrl);
  // TODO: Use authWithToken. Remember authWithPassword has a session timeout.
  await firebase.authWithPassword({
    email: 'firebasequeue@vetoapp.com',
    password: firebaseQueuePass
  });

  const queues = [
    new Queue(firebase.child('vetos-votes-queue'),
      (data, progress, resolve, reject) => {
        const vote = new Vote(data);
        const yesTotalPath = `vetos-votes-yes-total/${vote.vetoId}`;
        firebase
          .child(yesTotalPath).once('value')
          .then(snapshot => snapshot.val() || 0)
          .then(yesTotal => firebase
            .update({
              // If vetos-votes-yes-total is accidentally deleted, we can stop
              // queue updating, set correct value, then restart it. Easy.
              [yesTotalPath]: vote.yes ? ++yesTotal : --yesTotal,
              [`vetos-votes-yes/${vote.id}`]: vote.yes ? vote.toJS() : null,
              [`vetos-votes-no/${vote.id}`]: vote.yes ? null : vote.toJS()
            })
          )
          .then(resolve)
          .catch(reject);
      })
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
