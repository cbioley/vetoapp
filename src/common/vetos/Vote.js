import { Record } from 'immutable';

const VoteRecord = Record({
  createdAt: null,
  userId: null,
  vetoCountry: '',
  vetoCreatorDisplayName: '',
  vetoCreatorId: null,
  vetoId: null,
  vetoMunicipality: '',
  vetoName: '',
  yes: false
});

export default class Vote extends VoteRecord {

  // TODO: Remove it.
  static id(user, veto) {
    return new Vote({ userId: user.id, vetoId: veto.id }).id;
  }

  // Note compound key.
  get id() {
    return [this.vetoId, this.userId].join();
  }

}
