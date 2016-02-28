import { Record } from 'immutable';

const Veto = Record({
  country: '',
  createdAt: null,
  creatorId: null,
  id: '',
  // municipality: '',
  name: '',
  reason: '',
  updatedAt: null
});

export default Veto;
