import { Record } from 'immutable';

const VoteTotal = Record({
  total: 0,
  updatedAt: null,
  vetoCountry: '',
  vetoCreatorDisplayName: '',
  vetoCreatorId: null,
  vetoId: '',
  vetoMunicipality: '',
  vetoName: ''
});

export default VoteTotal;
