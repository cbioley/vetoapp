import Firebase from 'firebase';
import Queue from 'firebase-queue';
import Vote from '../../common/vetos/Vote';
import VoteTotal from '../../common/vetos/VoteTotal';

export default firebase => new Queue(
  firebase.child('vetos-votes-queue'),
  async (data, progress, resolve, reject) => {
    try {
      const vote = new Vote(data).toJS();
      const { vetoId, userId } = vote;
      const previousVote = await firebase
        .child('vetos-votes')
        .child(vote.yes ? 'yes' : 'no')
        .child('vetos').child(vetoId).child(userId)
        .once('value');
      if (previousVote.exists()) {
        resolve();
        return;
      }

      const yesTotalPath = 'vetos-votes-yes-total';
      const yesTotal = await firebase
        .child(`${yesTotalPath}/_all/${vetoId}/total`).once('value');
      const yesVoteTotal = new VoteTotal({
        total: (yesTotal.val() || 0) + (vote.yes ? 1 : -1),
        updatedAt: Firebase.ServerValue.TIMESTAMP,
        vetoCountry: vote.vetoCountry,
        vetoCreatorDisplayName: vote.vetoCreatorDisplayName,
        vetoCreatorId: vote.vetoCreatorId,
        vetoId,
        vetoMunicipality: vote.vetoMunicipality,
        vetoName: vote.vetoName
      }).toJS();

      const yesVoteValue = vote.yes ? vote : null;
      const noVoteValue = vote.yes ? null : vote;
      await firebase.update({
        // Denormalize for fast complex queries.
        [`${yesTotalPath}/_all/${vetoId}`]: yesVoteTotal,
        [`${yesTotalPath}/${vote.vetoCountry}/${vetoId}`]: yesVoteTotal,
        [`vetos-votes/yes/vetos/${vetoId}/${userId}`]: yesVoteValue,
        [`vetos-votes/yes/votes/${userId}/${vetoId}`]: yesVoteValue,
        [`vetos-votes/no/vetos/${vetoId}/${userId}`]: noVoteValue,
        [`vetos-votes/no/votes/${userId}/${vetoId}`]: noVoteValue
      });
      resolve();
    } catch (e) {
      console.log(e); // eslint-disable-line no-console
      reject(e);
    }
  });
