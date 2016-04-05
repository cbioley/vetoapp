import Firebase from 'firebase';
import Queue from 'firebase-queue';
import Vote from '../../common/vetos/Vote';
import VoteTotal from '../../common/vetos/VoteTotal';

export default firebase => new Queue(
  firebase.child('vetos-votes-queue'),
  async (data, progress, resolve, reject) => {
    try {
      const { userId, vetoId, yes } = data;
      const previousVote = await firebase
        .child('vetos-votes')
        .child(yes ? 'yes' : 'no')
        .child('vetos')
        .child(vetoId)
        .child(userId)
        .once('value');
      if (previousVote.exists()) {
        resolve();
        return;
      }
      const vetoVal = await firebase.child('vetos').child(vetoId).once('value');
      const veto = vetoVal.val();
      const yesTotalPath = 'vetos-votes-yes-total';
      const yesTotal = await firebase
        .child(`${yesTotalPath}/_all/${vetoId}/total`).once('value');
      const yesVoteTotal = new VoteTotal({
        total: (yesTotal.val() || 0) + (yes ? 1 : -1),
        updatedAt: Firebase.ServerValue.TIMESTAMP,
        vetoCountry: veto.country,
        vetoCreatorDisplayName: veto.creatorDisplayName,
        vetoCreatorId: veto.creatorId,
        vetoId,
        vetoMunicipality: veto.municipality,
        vetoName: veto.name
      }).toJS();
      const userVal = await firebase.child('users').child(userId).once('value');
      const user = userVal.val();
      const vote = new Vote({
        createdAt: Firebase.ServerValue.TIMESTAMP,
        userDisplayName: user.displayName,
        userId,
        userProfileImageURL: user.profileImageURL,
        vetoCountry: veto.country,
        vetoCreatorDisplayName: veto.creatorDisplayName,
        vetoCreatorId: veto.creatorId,
        vetoId,
        vetoMunicipality: veto.municipality,
        vetoName: veto.name,
        yes
      }).toJS();
      await firebase.update({
        // Denormalize for fast complex queries.
        [`${yesTotalPath}/_all/${vetoId}`]: yesVoteTotal,
        [`${yesTotalPath}/${veto.country}/${vetoId}`]: yesVoteTotal,
        [`vetos-votes/yes/vetos/${vetoId}/${userId}`]: yes ? vote : null,
        [`vetos-votes/yes/votes/${userId}/${vetoId}`]: yes ? vote : null,
        [`vetos-votes/no/vetos/${vetoId}/${userId}`]: yes ? null : vote,
        [`vetos-votes/no/votes/${userId}/${vetoId}`]: yes ? null : vote
      });
      resolve();
    } catch (e) {
      console.log(e); // eslint-disable-line no-console
      reject(e);
    }
  });
