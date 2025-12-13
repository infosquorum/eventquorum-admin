import { date } from 'zod';
import { _mock } from './_mock';

// ----------------------------------------------------------------------


export const _speakerList = Array.from({ length: 7 }, (_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  avatarUrl: _mock.image.avatar(index),
  isVerified: _mock.boolean(index),
  surname:  _mock.lastName(index),
  password: _mock.password(index),
  email: _mock.email(index),
  status: (index % 5 === 0 && 'inactive') || 'active',
  address: 'string',
  phoneNumber: _mock.phoneNumber(index),
}));