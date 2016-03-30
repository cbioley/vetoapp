import { Record } from 'immutable';

const Vote = Record({
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

// Subclass Vote to add en.wikipedia.org/wiki/Compound_key
export default class extends Vote {

  static id(veto, user) {
    return [veto && veto.id, user && user.id].join();
  }

  get id() {
    return [this.vetoId, this.userId].join();
  }

}
