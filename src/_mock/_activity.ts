import { _mock } from './_mock';


export const _activityList = Array.from({ length: 8 }, (_, index) => ({
    id: _mock.id(index),
    title: _mock.activityNames(index), 
    description : _mock.eventDescription(index),
    // link: _mock.number.rating(index),
    createdAt : new Date(_mock.time(index)),
    type: _mock.eventTypes(index),
    date: {
        startDate: new Date(_mock.time(index + 5)),
        endDate: new Date(_mock.time(index)),
      },
    // hour: {
    //     startDate: new Date(_mock.time(index + 5)),
    //     endDate: new Date(_mock.time(index)),
    //   },
    status:
      (index % 2 && 'en_cours') ||
      (index % 3 && 'terminer') ||
      'non_demarrer',
  }));