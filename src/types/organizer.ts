import type { IDateValue, ISocialLink } from './common';

// ----------------------------------------------------------------------

export type IOrganizerTableFilters = {
  name: string;
//   surname: string;

};

export type IOrganizerProfileCover = {
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IOrganizerProfile = {
  id: string;
  role: string;
  quote: string;
  email: string;
  school: string;
  country: string;
  company: string;
  totalFollowers: number;
  totalFollowing: number;
  socialLinks: ISocialLink;
};

export type IOrganizerProfileFollower = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
};

export type IOrganizerProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: IDateValue;
};

export type IOrganizerProfileFriend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IOrganizerProfilePost = {
  id: string;
  media: string;
  message: string;
  createdAt: IDateValue;
  personLikes: { name: string; avatarUrl: string }[];
  comments: {
    id: string;
    message: string;
    createdAt: IDateValue;
    author: { id: string; name: string; avatarUrl: string };
  }[];
};

export type IOrganizerCard = {
  id: string;
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
};

export type IOrganizerItem = {
  id: string;
  name: string;
  surname: string;
  password: string;
  email: string;
  status: string;
  address: string;
  avatarUrl: string;
  phoneNumber: string;
  isVerified: boolean;
  _raw?: any; // Données brutes du backend pour accès si besoin
};
