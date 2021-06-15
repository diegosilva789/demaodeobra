import axio from 'axios';

const token = localStorage.getItem('token')

const api = axio.create({
  baseURL: process.env.REACT_APP_BACKEND,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: token
  }
});

export default api;