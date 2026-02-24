import { TestGroup } from './types';

export const mockTestGroups: TestGroup[] = [
  {
    id: '019c8e8c-9c86-79da-a7fc-bf2ac3749645',
    name: 'BetaTesters',
    userCount: 3,
    userEmails: [
      'tony.morone@resideo.com',
      'nick.switch@gmail.com',
      'john.murphy@resideo.com',
    ],
  },
  {
    id: '019c8e8c-1234-5678-abcd-ef0123456789',
    name: 'DiagnosticLogs',
    userCount: 5,
    userEmails: [
      'dev1@resideo.com',
      'dev2@resideo.com',
      'qa1@resideo.com',
      'qa2@resideo.com',
      'support@resideo.com',
    ],
  },
  {
    id: '019c8e8c-aaaa-bbbb-cccc-ddddeeeefffff',
    name: 'DenaIlluminaPlugin',
    userCount: 2,
    userEmails: ['tony.morone@resideo.com', 'amjad@grr.la'],
  },
  {
    id: '019c8e8c-0000-1111-2222-333344445555',
    name: 'NewFeatureX',
    userCount: 0,
    userEmails: [],
  },
];
