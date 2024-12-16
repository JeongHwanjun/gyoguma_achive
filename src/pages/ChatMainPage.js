import React from 'react';
import ChatRoomList from '../components/chat/ChatRoomList'
import { useSelector } from 'react-redux';
import { withAuth } from '../components/utils/withAuth';

function ChatMainPage() {
  const { userId } = useSelector((state) => state.auth)

  return (
    <ChatRoomList userId={userId} />
  );
}

export default withAuth(ChatMainPage)