import React, { useEffect } from 'react';
import ChatRoomList from '../components/chat/ChatRoomList'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function ChatMainPage() {
  const navigate = useNavigate()
  const { userId, isAuthenticated, } = useSelector((state) => state.auth)

  useEffect(() => {
    if(!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.')
      navigate('/')
    }
  })
  return (
    <ChatRoomList userId={userId} />
  );
}

export default ChatMainPage;