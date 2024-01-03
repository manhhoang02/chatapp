import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import Config from 'react-native-config';
import {Post} from './post.type';

const getPosts = async (page: number, pageSize: number): Promise<Post[]> => {
  return await axios
    .get(`${Config.BASE_URL}/post/`, {
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

export const useGetPosts = (page: number, pageSize: number, reload: number) =>
  useQuery({
    queryKey: ['Posts', page, reload],
    queryFn: () => getPosts(page, pageSize),
  });
export const createPost = async (params: FormData): Promise<Post> => {
  return await axios
    .post(`${Config.BASE_URL}/post`, params, {
      headers: {
        'Content-Type': 'multipart/form-data', // android sẽ lỗi nếu k có
      },
    })
    .then(({data}) => {
      return data;
    })
    .catch(error => {
      throw new Error(error.message);
    });
};
const getPostsProfile = async (
  userId: string,
  page: number,
  pageSize: number,
): Promise<Post[]> => {
  return await axios
    .get(`${Config.BASE_URL}/post/others`, {
      params: {
        userId,
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

export const useGetPostsProfile = (
  userId: string,
  page: number,
  pageSize: number,
) =>
  useQuery({
    queryKey: ['Posts', userId, page],
    queryFn: () => getPostsProfile(userId, page, pageSize),
  });
export const likeOrDislikePost = async (postId: string): Promise<Post> => {
  return await axios
    .post(`${Config.BASE_URL}/post/likeOrDislike`, {
      postId,
    })
    .then(({data}) => {
      return data;
    })
    .catch(error => {
      throw new Error(error.message);
    });
};

export const getPost = async (postId: string): Promise<Post> => {
  return await axios
    .get(`${Config.BASE_URL}/post/${postId}`)
    .then(({data}) => {
      return data;
    })
    .catch(error => {
      throw new Error(error.message);
    });
};
