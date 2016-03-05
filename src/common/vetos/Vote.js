import { Record } from 'immutable';

const VoteRecord = Record({
  createdAt: null,
  userId: null,
  vetoId: null,
  yes: false
});

export default class Vote extends VoteRecord {
  // Note compound key.
  get id() {
    return [this.vetoId, this.userId].join();
  }
}
