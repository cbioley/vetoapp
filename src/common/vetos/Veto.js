import { Record } from 'immutable';

const Veto = Record({
  country: '',
  createdAt: null,
  creatorDisplayName: '',
  creatorId: null,
  creatorProfileImageURL: '',
  id: '',
  municipality: '',
  name: '',
  reason: '',
  updatedAt: null
});

export default Veto;
