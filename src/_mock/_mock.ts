import { fSub } from 'src/utils/format-time';

import { CONFIG } from 'src/global-config';

import {
  _id,
  _ages,
  _roles,
  _clients,
  _prices,
  _emails,
  _ratings,
  _nativeS,
  _nativeM,
  _nativeL,
  _clientEventNumber,
  _percents,
  _booleans,
  _sentences,
  _lastNames,
  _fullNames,
  _tourNames,
  _jobTitles,
  _clientsCreationDates,
  _taskNames,
  _passwords,
  _fileNames,
  _postTitles,
  _firstNames,
  _eventNames,
  _eventTypes,
  _courseNames,
  _fullAddress,
  _companyNames,
  _productNames,
  _descriptions,
  _phoneNumbers,
  _countryNames,
  _city,
  _periods,
  _eventDescriptions,
  _activityNames,
} from './assets';

// ----------------------------------------------------------------------

export const _mock = {
  id: (index: number) => _id[index],
  time: (index: number) => fSub({ days: index, hours: index }),
  boolean: (index: number) => _booleans[index],
  role: (index: number) => _roles[index],
  client: (index: number) => _clients[index],
  // Text
  courseNames: (index: number) => _courseNames[index],
  fileNames: (index: number) => _fileNames[index],
  eventNames: (index: number) => _eventNames[index],
  activityNames: (index: number) => _activityNames[index],
  eventDescription: (index: number) => _eventDescriptions[index],
  eventTypes: (index: number) => _eventTypes[index],
  taskNames: (index: number) => _taskNames[index],
  postTitle: (index: number) => _postTitles[index],
  jobTitle: (index: number) => _jobTitles[index],
  tourName: (index: number) => _tourNames[index],
  productName: (index: number) => _productNames[index],
  password: (index: number) => _passwords[index],
  sentence: (index: number) => _sentences[index],
  description: (index: number) => _descriptions[index],
  // Contact
  email: (index: number) => _emails[index],
  phoneNumber: (index: number) => _phoneNumbers[index],
  clientsCreationDate: (index: number) => _clientsCreationDates[index],
  fullAddress: (index: number) => _fullAddress[index],
  // Name
  firstName: (index: number) => _firstNames[index],
  lastName: (index: number) => _lastNames[index],
  fullName: (index: number) => _fullNames[index],
  companyNames: (index: number) => _companyNames[index],
  countryNames: (index: number) => _countryNames[index],
  city: (index: number) => _city[index],
  period: (index: number) => _periods[index],
  // Number
  number: {
    percent: (index: number) => _percents[index],
    rating: (index: number) => _ratings[index],
    age: (index: number) => _ages[index],
    price: (index: number) => _prices[index],
    nativeS: (index: number) => _nativeS[index],
    nativeM: (index: number) => _nativeM[index],
    nativeL: (index: number) => _nativeL[index],
    clientEventNumber: (index: number) => _clientEventNumber[index],
    range: (min: number, max: number): number => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
  },
  date: (index: number) => {
    const baseDate = new Date(2024, 0, 1); // 1er janvier 2024
    return new Date(baseDate.setDate(baseDate.getDate() + index * 14)); // Ajoute 14 jours par index
  },
  // Image
  image: {
    cover: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/cover/cover-${index + 1}.webp`,
    avatar: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/avatar/avatar-${index + 1}.webp`,
    travel: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/travel/travel-${index + 1}.webp`,
    course: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/course/course-${index + 1}.webp`,
    company: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/company/company-${index + 1}.webp`,
    product: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/m-product/product-${index + 1}.webp`,
    portrait: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/portrait/portrait-${index + 1}.webp`,

    personClient:`${CONFIG.assetsDir}/assets/images/mock/user/user.png`,
  },
};
