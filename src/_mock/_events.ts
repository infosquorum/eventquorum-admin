// src/_mock/_events.ts

import type { IEventItem } from 'src/types/event';
import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const _eventList: IEventItem[] = Array.from({ length: 8 }, (_, index) => {
  // ✅ Générer des dates cohérentes
  const baseDate = new Date(_mock.time(index));
  const startDate = new Date(baseDate);
  const endDate = new Date(baseDate);
  endDate.setDate(endDate.getDate() + _mock.number.range(1, 5)); // Événement de 1 à 5 jours

  return {
    id: _mock.id(index),
    logo: _mock.image.course(index), 
    coverUrl: _mock.image.cover(index), 
    logoClient: _mock.image.avatar(index),
    nomclient: _mock.client(index),
    matricule: `EVT-${String(index + 1).padStart(4, '0')}`,
    name: _mock.eventNames(index), 
    description: _mock.eventDescription(index),
    participants: _mock.number.range(50, 500),
    avis: _mock.number.rating(index),
    likes: _mock.number.range(1000, 5000),
    revenue: _mock.number.range(50000, 500000),
    createdAt: new Date(_mock.time(index)),
    type: _mock.eventTypes(index),
    date: _mock.period(index),
    
    // ✅ Ajout des champs manquants requis par IEventItem
    startDate: startDate.toISOString(), // string ISO format
    endDate: endDate.toISOString(),     // string ISO format
    
    location: `${_mock.city(index)}, ${_mock.countryNames(index)}`,
    status:
      (index % 2 && 'en cours') ||
      (index % 3 && 'terminé') ||
      (index % 4 && 'suspendu') ||
      'non demarré',
    photos: Array.from({ length: 9 }).map((_, photoIndex) => ({
      id: _mock.id(photoIndex),
      imageUrl: _mock.image.travel(photoIndex),
      description: `Photo ${photoIndex + 1}`,
      createdAt: new Date(_mock.time(photoIndex)),
      likes: _mock.number.range(10, 100)
    }))
  };
});

// ✅ Le reste du fichier reste INCHANGÉ
export const _eventTypesList = Array.from({ length: 8 }, (_, index) => ({
    id: _mock.id(index),
    name: _mock.eventTypes(index), 
}));

export const _mockEvents = Array.from({ length: 8 }, (_, index) => ({
  id: _mock.id(index),
  name: _mock.eventNames(index),
  logo: _mock.image.company(index),
  coverUrl: _mock.image.cover(index),
  description: _mock.eventDescription(index),
  location: `${_mock.city(index)}, ${_mock.countryNames(index)}`,
  matricule: `EVT-${String(index + 1).padStart(4, '0')}`,

  client: {
    id: _mock.id(index),
    name: _mock.fullName(index),
    avatarUrl: _mock.image.avatar(index),
    phoneNumber: _mock.phoneNumber(index),
    logo: _mock.image.company(index),
  },

  createdAt: new Date(_mock.time(index)),
  available: {
    startDate: new Date(_mock.time(index + 5)),
    endDate: new Date(_mock.time(index)),
  },
  date: _mock.period(index),

  barcoderegistration: index % 2 === 0,
  qrcoderegistration: index % 3 === 0,
  domain_type: index % 2 === 0 ? 'personalized' : 'standard',
  domain_value: index % 2 === 0 
    ? `client-${index}.client.com` 
    : `event-${index}.eventquorum.com`,

  status: (index % 2 && 'en cours') ||
    (index % 3 && 'terminé') ||
    'non demarré',
  participants: _mock.number.range(50, 500),
  likes: _mock.number.range(1000, 5000),
  avis: _mock.number.rating(index),
  revenue: _mock.number.range(50000, 500000),

  photos: Array.from({ length: 3 }).map((_, photoIndex) => ({
    id: _mock.id(photoIndex),
    imageUrl: _mock.image.travel(photoIndex),
    description: `Photo ${photoIndex + 1}`,
    createdAt: new Date(_mock.time(photoIndex)),
    likes: _mock.number.range(10, 100),
  })),

  organizer: Array.from({ length: _mock.number.range(1, 4) }).map((_, orgIndex) => ({
    id: _mock.id(orgIndex),
    name: _mock.fullName(orgIndex),
    avatarUrl: _mock.image.avatar(orgIndex),
    phoneNumber: _mock.phoneNumber(orgIndex),
  })),
  type: _eventTypesList[index % _eventTypesList.length].name,
}));

export const _singleMockEvent = _mockEvents[0];