import {useMutation, useQuery} from '@tanstack/react-query';
import axios from 'axios';
import Config from 'react-native-config';
import {
  Friend,
  ResFriendList,
  ResLogin,
  ResRegister,
  ResUser,
} from './auth.type';
import {consoleLog} from '@abong.code/helpers/logHelper';

type ParamsLogin = {
  email: string;
  password: string;
};
const login = async (params: ParamsLogin): Promise<ResLogin> => {
  return await axios
    .post(`${Config.BASE_URL}/auth/login`, {
      email: params.email,
      password: params.password,
    })
    .then(({data}) => {
      return data;
    })
    .catch(error => {
      throw new Error(error.message);
    });
};
export const useLogin = () =>
  useMutation({
    mutationFn: (params: ParamsLogin) => login(params),
  });
export const getProfileMe = async (): Promise<ResUser> => {
  return await axios
    .get(`${Config.BASE_URL}/user/profile`)
    .then(({data}) => {
      return data;
    })
    .catch(error => {
      throw new Error(error.message);
    });
};

const getProfileUser = async (id: string): Promise<ResUser> => {
  return await axios
    .get(`${Config.BASE_URL}/user/profile/${id}`)
    .then(({data}) => {
      return data;
    })
    .catch(error => {
      throw new Error(error.message);
    });
};
export const useGetProfileUser = (id: string) =>
  useQuery({
    queryKey: ['Profile-user', id],
    queryFn: () => getProfileUser(id),
  });

type ParamsRegister = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

const register = async (params: ParamsRegister): Promise<ResRegister> =>
  await axios
    .post(`${Config.BASE_URL}/auth/register`, {
      first_name: params.first_name,
      last_name: params.last_name,
      email: params.email,
      password: params.password,
    })
    .then(({data}) => data)
    .catch(err => {
      consoleLog(err, 'errrrrrr');
      throw new Error(err);
    });

export const useRegister = () =>
  useMutation({mutationFn: (params: ParamsRegister) => register(params)});

const getFriendList = async (
  search: string,
  page: number,
  pageSize: number,
): Promise<ResFriendList> => {
  return await axios
    .get(`${Config.BASE_URL}/user/friend-list`, {
      params: {
        search,
        page,
        pageSize,
      },
    })
    .then(({data}) => {
      return data;
    })
    .catch(error => {
      throw new Error(error.message);
    });
};

export const useGetFriendList = (
  search: string,
  page: number,
  pageSize: number,
  reload: number,
) =>
  useQuery({
    queryKey: ['Friend-List', page, search, reload],
    queryFn: () => getFriendList(search, page, pageSize),
  });

const getFriendRequests = async (
  page: number,
  pageSize: number,
): Promise<ResFriendList> => {
  return await axios
    .get(`${Config.BASE_URL}/user/list-friend-request`, {
      params: {
        page,
        pageSize,
      },
    })
    .then(({data}) => {
      return data;
    })
    .catch(error => {
      throw new Error(error.message);
    });
};

export const useGetFriendRequests = (
  page: number,
  pageSize: number,
  reload: number,
) =>
  useQuery({
    queryKey: ['LIST-FRIEND-REQUEST', page, pageSize, reload],
    queryFn: () => getFriendRequests(page, pageSize),
  });

const sendOTP = async (email: string) =>
  await axios
    .post(`${Config.BASE_URL}/auth/forgot-password/send-otp`, {
      email,
    })
    .then(({data}) => data)
    .catch(err => {
      throw new Error(err.message);
    });

export const useSendOTP = () =>
  useMutation({mutationFn: (email: string) => sendOTP(email)});

type ParamsVerifyOTP = {
  email: string;
  otp: string;
};
const verifyOTP = async (params: ParamsVerifyOTP) =>
  await axios
    .post(`${Config.BASE_URL}/auth/verify-otp`, params)
    .then(({data}) => data)
    .catch(err => {
      throw new Error(err.message);
    });

export const useVerifyOTP = () =>
  useMutation({mutationFn: (params: ParamsVerifyOTP) => verifyOTP(params)});

type ParamsResetPassword = {
  email: string;
  password: string;
};
const resetPassword = async (params: ParamsResetPassword) =>
  await axios
    .post(`${Config.BASE_URL}/auth/reset-password`, params)
    .then(({data}) => data)
    .catch(err => {
      throw new Error(err.message);
    });

export const useResetPassword = () =>
  useMutation({
    mutationFn: (params: ParamsResetPassword) => resetPassword(params),
  });

const findUsers = async (
  page: number,
  pageSize: number,
  search: string,
): Promise<Friend[]> => {
  return await axios
    .get(`${Config.BASE_URL}/user`, {
      params: {
        page,
        pageSize,
        search,
      },
    })
    .then(({data}) => {
      return data;
    })
    .catch(error => {
      throw new Error(error.message);
    });
};

export const useFindUsers = (page: number, pageSize: number, search: string) =>
  useQuery({
    queryKey: ['Find-user', page, pageSize, search],
    queryFn: () => findUsers(page, pageSize, search),
  });

export const useAddFriend = () =>
  useMutation({
    mutationFn: async (friendId: string) =>
      axios.put(`${Config.BASE_URL}/user/add-friend`, {
        friendId,
      }),
  });

export const useSendRequestFriend = () =>
  useMutation({
    mutationFn: async (friendId: string) =>
      axios.put(`${Config.BASE_URL}/user/send-request-friend`, {
        friendId,
      }),
  });

export const addFcmToken = async (fcmToken: string): Promise<ResUser> => {
  return await axios
    .post(`${Config.BASE_URL}/user/add-fcmToken`, {
      fcmToken,
    })
    .then(({data}) => {
      return data;
    })
    .catch(error => {
      throw new Error(error.message);
    });
};

export const logout = async (deleteFcmToken: string): Promise<ResUser> => {
  return await axios
    .post(`${Config.BASE_URL}/user/logout`, {
      deleteFcmToken,
    })
    .then(({data}) => {
      return data;
    })
    .catch(error => {
      throw new Error(error.message);
    });
};
type ParamsLoginSocial = {
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  role: string;
};
const loginSocial = async (params: ParamsLoginSocial): Promise<ResLogin> => {
  return await axios
    .post(`${Config.BASE_URL}/auth/loginSocial`, params)
    .then(({data}) => {
      return data;
    })
    .catch(error => {
      throw new Error(error.message);
    });
};
export const useLoginSocial = () =>
  useMutation({mutationFn: (params: ParamsLoginSocial) => loginSocial(params)});
