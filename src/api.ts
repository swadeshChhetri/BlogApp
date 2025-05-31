import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://your-api-url.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default instance;
