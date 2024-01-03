import axios from 'axios';

export const initApiHeader = (token?: string) => {
  axios.defaults.headers.common = {
    'Content-Type': 'application/json',
    ...(token && {Authorization: `Bearer ${token}`}),
  };
  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      return error.response;
    },
  );
};
