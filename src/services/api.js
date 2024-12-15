import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Replace with your backend URL

export const api = {
  createChatRoom: (buyerId, sellerId, productId) => {
    return axios.post(`${API_BASE_URL}/chat`, {
      buyer: buyerId,
      seller: sellerId,
      product: productId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },

  enterChatRoom: (roomId, userId) => {
    return axios.post(`${API_BASE_URL}/chat/${roomId}/${userId}`);
  },


  getChatRoomsByUser: (userId) => {
    return axios.get(`${API_BASE_URL}/chat/user/${userId}`);
  },

  getChatMessages: (roomId) => {
    return axios.get(`${API_BASE_URL}/chat/${roomId}`); // Corrected endpoint
  },

  deleteChatRoom: (roomId) => {
    return axios.delete(`${API_BASE_URL}/chat/${roomId}`); // Corrected endpoint
  },
};