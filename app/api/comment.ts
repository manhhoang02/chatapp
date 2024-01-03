import Config from 'react-native-config';
import {Comment} from './comment.type';
import axios from 'axios';
import {useQuery} from '@tanstack/react-query';

const getComments = async (
  postId: string,
  page: number,
  pageSize: number,
): Promise<Comment[]> => {
  return await axios
    .get(`${Config.BASE_URL}/comment/${postId}`, {
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

export const useGetComments = (
  postId: string,
  page: number,
  pageSize: number,
  reLoad: number,
) =>
  useQuery({
    queryKey: ['Comments', postId, page, reLoad],
    queryFn: () => getComments(postId, page, pageSize),
  });

export const createComment = async (params: FormData): Promise<Comment> => {
  return await axios
    .post(`${Config.BASE_URL}/comment/`, params)
    .then(({data}) => {
      return data;
    })
    .catch(error => {
      throw new Error(error.message);
    });
};
