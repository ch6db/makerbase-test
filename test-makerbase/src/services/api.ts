import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const api = {
  async jog(x: number, y: number) {
    return axios.post(`${API_URL}/jog`, { x, y });
  },

  async home() {
    return axios.post(`${API_URL}/home`);
  },

  async setHome() {
    return axios.post(`${API_URL}/set-home`);
  }
};