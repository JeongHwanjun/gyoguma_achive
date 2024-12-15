// src/api/index.js
import axiosInstance from "./axiosInstance";

export const API = {
  product: {
    getAll: (page) =>
      axiosInstance.get("/products", { params: { page } }),

    getById: (productId) =>
      axiosInstance.get(`/products/${productId}`),

    create: (data) =>
      axiosInstance.post("/products/", data),

    update: (productId, data) =>
      axiosInstance.patch(`/products/${productId}`, data),

    delete: (productId) =>
      axiosInstance.delete(`/products/${productId}`),

    getByMember: (memberId) =>
      axiosInstance.get(`/products/${memberId}`),

    search: (keyword) =>
      axiosInstance.get("/products/search", { params: { keyword } }),
  },

  auth: {
    // Google OAuth 로그인 URL 얻기
    getGoogleAuthUrl: () =>
      axiosInstance.get("/oauth2/authorization/google"),

    // OAuth 콜백 처리
    handleOAuthCallback: (code) =>
      axiosInstance.get("/oauth2/callback/google", { params: { code } }),

    signup: (data) =>
      axiosInstance.post("/members/signup", data),

    login: (data) =>
      axiosInstance.post("/login", data),
  },

  member: {
    update: (memberId, data) =>
      axiosInstance.patch(`/members/${memberId}`, data),

    delete: (memberId) =>
      axiosInstance.delete(`/members/${memberId}`),
  },

  review: {
    create: (memberId, data) =>
      axiosInstance.post(`/reviews/${memberId}`, data),
  },

  chat: {
    // 채팅방 생성 요청
    create: (buyerId, sellerId, productId) =>
      axiosInstance.post("/chat", {
        buyer: buyerId,
        seller: sellerId,
        product: productId
      }),

    // 채팅방 입장 요청
    enter: (roomId, userId) =>
      axiosInstance.post(`/chat/${roomId}/${userId}`),

    // userId별 채팅방 요청
    getUserRooms: (userId) =>
      axiosInstance.get(`/chat/user/${userId}`),

    // 기존 채팅방의 메세지 요청
    getMessages: (roomId) =>
      axiosInstance.get(`/chat/${roomId}`),

    // 채팅방 삭제 요청
    delete: (roomId) =>
      axiosInstance.delete(`/chat/${roomId}`),
  }

};