// import Firebase from 'firebase';
import Queue from 'firebase-queue';
// import Veto from '../../common/vetos/Veto';

// TODO: Use Queue factory, so we don't have to repeat try catch etc.
export default firebase => new Queue(
  firebase.child('vetos-archive-queue'),
  async (data, progress, resolve, reject) => {
    try {
      const { vetoId } = data;
      const vetoVal = await firebase.child('vetos').child(vetoId).once('value');
      if (!vetoVal.exists()) {
        resolve();
        return;
      }
      const veto = vetoVal.val();

      // www.firebase.com/blog/2015-10-07-how-to-keep-your-data-consistent.html
      const update = {};

      const yesVetosUsersVal = await firebase
        .child('vetos-votes/yes/vetos')
        .child(vetoId)
        .once('value');
      const yesVetosUsers = Object.keys(yesVetosUsersVal.val() || {});

      // Archive veto.
      update[`vetos/${veto.id}`] = null;
      update[`vetos-archived/${veto.id}`] = veto;
      // Delete votes. TODO: Archive them.
      update[`vetos-votes/yes/vetos/${veto.id}`] = null;
      update[`vetos-votes/no/vetos/${veto.id}`] = null;
      yesVetosUsers.forEach(userId => {
        update[`vetos-votes/yes/votes/${userId}/${veto.id}`] = null;
        update[`vetos-votes/no/votes/${userId}/${veto.id}`] = null;
      });
      // Delete yes totals. TODO: Archive them.
      update[`vetos-votes-yes-total/_all/${veto.id}`] = null;
      update[`vetos-votes-yes-total/${veto.country}/${veto.id}`] = null;

      await firebase.update(update);
      resolve();
    } catch (e) {
      console.log(e); // eslint-disable-line no-console
      reject(e);
    }
  });
