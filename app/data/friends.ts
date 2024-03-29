import {Friend} from 'app/api/auth.type';

// Tạo mảng gồm 10 phần tử với dữ liệu ngẫu nhiên
const generateFriendsData = (): Friend[] => {
  const friendsData: Friend[] = [];

  for (let i = 0; i < 10; i++) {
    const friend: Friend = {
      _id: Math.random().toString(),
      first_name: `First Name ${i + 1}`,
      last_name: `Last Name ${i + 1}`,
      avatar:
        'https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg',
      email: `email${i + 1}@example.com`,
    };
    friendsData.push(friend);
  }

  return friendsData;
};

// Dữ liệu mảng 10 phần tử với kiểu dữ liệu Friend
export const friendsData: Friend[] = generateFriendsData();
