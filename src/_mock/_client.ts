import { date } from 'zod';
import { _mock } from './_mock';

// ----------------------------------------------------------------------


export const _clientList = Array.from({ length: 11 }, (_, index) => ({
  id: _mock.id(index),
  logo: _mock.image.company(index),
  personLogo: _mock.image.personClient,
  address: _mock.city(index),
  contact_name: _mock.lastName(index),
  contact_firstname: _mock.firstName(index),
  contact_email: _mock.email(index),
  contact_phone: _mock.phoneNumber(index),
  email: _mock.email(index),
  company_name: _mock.client(index),
  isMoralePerson: _mock.boolean(index),
  phoneNumber: _mock.phoneNumber(index),
  eventNumber: _mock.number.clientEventNumber(index),
  creationDate:_mock.clientsCreationDate(index),
  num_identification: `ID-${_mock.id(index)}`,
}));


