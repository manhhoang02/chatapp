import {ChatProps} from 'app/api/chat.type';

export const chatsData: ChatProps[] = [
  {
    _id: 'chat123',
    members: [
      {
        _id: '66011eb0918fa59801755637',
        first_name: 'John',
        last_name: 'Doe',
        avatar:
          'https://cdn.sforum.vn/sforum/wp-content/uploads/2022/04/p2.jpg',
      },
      {
        _id: 'user456',
        first_name: 'Jane',
        last_name: 'Smith',
        avatar:
          'https://cdn.sforum.vn/sforum/wp-content/uploads/2022/04/p2.jpg',
      },
    ],
    createdAt: '2024-03-29T15:29:00.000Z',
    updatedAt: '2024-03-29T15:29:00.000Z',
    __v: 0,
    lastMessage: {
      _id: 'message789',
      chatId: 'chat123',
      senderId: 'user1',
      files: [
        'https://cdn.i-scmp.com/sites/default/files/styles/768x768/public/d8/images/canvas/2023/08/21/c080045a-e333-40c5-aee8-17c42ce9b47e_65e19817.jpg?itok=KNdRuSea&v=1692611441',
      ],
      text: '',
      createdAt: '2024-03-29T15:28:00.000Z',
      updatedAt: '2024-03-29T15:28:00.000Z',
      __v: 0,
    },
  },
  {
    _id: 'chat456',
    members: [
      {
        _id: '66011eb0918fa59801755637',
        first_name: 'Alice',
        last_name: 'Johnson',
        avatar:
          'https://cdn.sforum.vn/sforum/wp-content/uploads/2022/04/p2.jpg',
      },
      {
        _id: 'user012',
        first_name: 'Bob',
        last_name: 'Williams',
        avatar:
          'https://cdn.sforum.vn/sforum/wp-content/uploads/2022/04/p2.jpg',
      },
    ],
    createdAt: '2024-03-29T14:29:00.000Z',
    updatedAt: '2024-03-29T14:29:00.000Z',
    __v: 0,
    lastMessage: {
      _id: 'message098',
      chatId: 'chat456',
      senderId: 'user789',
      files: [],
      text: 'How are you doing?',
      createdAt: '2024-03-29T14:27:00.000Z',
      updatedAt: '2024-03-29T14:27:00.000Z',
      __v: 0,
    },
  },
  {
    _id: 'chat789',
    members: [
      {
        _id: 'user321',
        first_name: 'Charlie',
        last_name: 'Brown',
        avatar:
          'https://cdn.sforum.vn/sforum/wp-content/uploads/2022/04/p2.jpg',
      },
      {
        _id: '66011eb0918fa59801755637',
        first_name: 'Diana',
        last_name: 'Prince',
        avatar:
          'https://cdn.sforum.vn/sforum/wp-content/uploads/2022/04/p2.jpg',
      },
    ],
    createdAt: '2024-03-29T13:29:00.000Z',
    updatedAt: '2024-03-29T13:29:00.000Z',
    __v: 0,
    lastMessage: {
      _id: 'message123',
      chatId: 'chat789',
      senderId: 'user321',
      files: [],
      text: 'I am doing great, thanks for asking!',
      createdAt: '2024-03-29T13:28:00.000Z',
      updatedAt: '2024-03-29T13:28:00.000Z',
      __v: 0,
    },
  },
  {
    _id: 'chat012',
    members: [
      {
        _id: '66011eb0918fa59801755637',
        first_name: 'Edward',
        last_name: 'Elric',
        avatar:
          'https://cdn.sforum.vn/sforum/wp-content/uploads/2022/04/p2.jpg',
      },
      {
        _id: 'user258',
        first_name: 'Winry',
        last_name: 'Rockbell',
        avatar:
          'https://cdn.sforum.vn/sforum/wp-content/uploads/2022/04/p2.jpg',
      },
    ],
    createdAt: '2024-03-29T12:29:00.000Z',
    updatedAt: '2024-03-29T12:29:00.000Z',
    __v: 0,
    lastMessage: {
      _id: 'message456',
      chatId: 'chat012',
      senderId: 'user987',
      files: [],
      text: 'I need to transmute some automail.',
      createdAt: '2024-03-29T12:28:00.000Z',
      updatedAt: '2024-03-29T12:28:00.000Z',
      __v: 0,
    },
  },
  {
    _id: 'chat345',
    members: [
      {
        _id: 'user512',
        first_name: 'Goku',
        last_name: 'Son',
        avatar:
          'https://cdn.sforum.vn/sforum/wp-content/uploads/2022/04/p2.jpg',
      },
      {
        _id: '66011eb0918fa59801755637',
        first_name: 'Vegeta',
        last_name: 'Brief',
        avatar:
          'https://cdn.sforum.vn/sforum/wp-content/uploads/2022/04/p2.jpg',
      },
    ],
    createdAt: '2024-03-29T11:29:00.000Z',
    updatedAt: '2024-03-29T11:29:00.000Z',
    __v: 0,
    lastMessage: {
      _id: 'message789',
      chatId: 'chat345',
      senderId: 'user512',
      files: [],
      text: 'It"s over 9000!',
      createdAt: '2024-03-29T11:28:00.000Z',
      updatedAt: '2024-03-29T11:28:00.000Z',
      __v: 0,
    },
  },
];
