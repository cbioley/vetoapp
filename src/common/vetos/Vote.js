import { Record } from 'immutable';

const VoteRecord = Record({
  createdAt: null,
  userId: null,
  vetoId: null,
  yes: false
});

export default class Vote extends VoteRecord {

  static id(veto, user) {
    if (!veto || !user) return null;
    return new Vote({ vetoId: veto.id, userId: user.id }).id;
  }

  // Note compound key.
  get id() {
    return [this.vetoId, this.userId].join();
  }

}
