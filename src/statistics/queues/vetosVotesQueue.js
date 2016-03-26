import Firebase from 'firebase';
import Queue from 'firebase-queue';
import Vote from '../../common/vetos/Vote';
import VoteTotal from '../../common/vetos/VoteTotal';

export default firebase => new Queue(
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
      const yesTotalPath = 'vetos-votes-yes-total';
      const yesTotal = await firebase
        .child(`${yesTotalPath}/_all/${vote.vetoId}/total`).once('value');
      const yesVoteTotal = new VoteTotal({
        total: (yesTotal.val() || 0) + (vote.yes ? 1 : -1),
        updatedAt: Firebase.ServerValue.TIMESTAMP,
        vetoCountry: vote.vetoCountry,
        vetoCreatorDisplayName: vote.vetoCreatorDisplayName,
        vetoCreatorId: vote.vetoCreatorId,
        vetoId: vote.vetoId,
        vetoMunicipality: vote.vetoMunicipality,
        vetoName: vote.vetoName
      }).toJS();
      await firebase.update({
        // Denormalization for fast complex queries.
        [`${yesTotalPath}/_all/${vote.vetoId}`]: yesVoteTotal,
        [`${yesTotalPath}/${vote.vetoCountry}/${vote.vetoId}`]: yesVoteTotal,
        [`vetos-votes-yes/${vote.id}`]: vote.yes ? vote.toJS() : null,
        [`vetos-votes-no/${vote.id}`]: vote.yes ? null : vote.toJS()
      });
      resolve();
    } catch (e) {
      console.log(e); // eslint-disable-line no-console
      reject(e);
    }
  });
