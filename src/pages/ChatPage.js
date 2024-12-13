// 채팅 페이지
import React, { useCallback, useEffect, useState } from 'react';
import ChatInput from '../components/chat/ChatInput';
import ChatMessage from '../components/chat/ChatMessage';
import ChatParticipants from '../components/chat/ChatParticipants';
import ChatProduct from '../components/chat/ChatProduct'
import ChatCompleteButton from '../components/chat/ChatCompleteButton';
import ScheduleContainer from '../components/chat/ScheduleContainer';
import { Navigate, useParams } from 'react-router-dom';
import { API } from '../api/index';
import { connect, sendMessage, leaveChatRoom, enterChatRoom as enterChatRoomSocket, disconnect } from '../services/socket';
import { useSelector } from 'react-redux';

function ChatPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [complete, setComplete] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [stompClient, setStompClient] = useState(null)
  const {roomId} = useParams()
  const {userId, userNickName, isAuthenticated} = useSelector((state) => state.auth)

  // 채팅방에 연결. socket을 연결, 구독하고 입장 메세지를 publish합니다.
  useEffect(() => {
    // 로그인이 필요한 서비스임
    if(!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.')
      Navigate('/')
    }

    if(!stompClient || stompClient.connected) {
      const client = connect(roomId, (message) => {
        setMessages((prev) => [...prev, JSON.parse(message.body)])
      })

      let hasEnteredRoom = false; // Add flag to prevent double entry

      client.onConnect = () => {
        console.log('WebSocket connected!');
        client.subscribe(`/sub/chat/room/${roomId}`, (message) => {
          setMessages((prev) => [...prev, JSON.parse(message.body)]);
        });
        if (!hasEnteredRoom) { // Only send ENTER message once
        hasEnteredRoom = true;
        const enterMessage = {
          roomId: roomId,
          senderId: userId,
          nickname: userNickName,
          message: '',
          type: 'ENTER',
        };
        enterChatRoomSocket(client, enterMessage);
        }
      };
      setStompClient(client)
    }

    return () => {
      if(stompClient) disconnect(roomId)
    }
  },[roomId, userId, userNickName, isAuthenticated, stompClient])

  // 채팅방 초기화, 과거의 채팅들을 가져옵니다.
  useEffect(() => {
    const initializeChatRoom = async () => {
      try{
        const messageResponse = await API.chat.getMessages(roomId);
        setMessages(messageResponse.data);
      } catch (error) {
        console.error('Error initializing chat room:', error);
      }
    }

    initializeChatRoom()
  }, [roomId])

  // socket에 신규 메세지를 publish합니다.
  const handleSendMessage = useCallback((message) => {
    const chatMessage = {
      roomId: roomId,
      senderId: userId,
      nickname: userNickName,
      message: message,
      type: 'TALK',
    };
    sendMessage(stompClient, chatMessage);
  },[roomId, stompClient, userId, userNickName])

  // leave 메세지를 publish하고 구독과 연결을 해지합니다.
  const handleLeaveChatRoom = useCallback(() => {
    const leaveMessage = {
      roomId: roomId,
      senderId: userId,
      nickname: userNickName,
      message: '',
      type: 'LEAVE',
    };
    leaveChatRoom(stompClient, leaveMessage);
  },[roomId, stompClient, userId, userNickName])

  return (
    <div className='flex flex-row justify-center space-x-16 p-16'>
      <div className="flex flex-col w-96 h-[724px] mx-auto border border-orange-300 rounded-lg bg-orange-50">
        <ChatParticipants buyerName={'상대방'} />
        <ChatProduct product={{title : 'title', price : '3020'}} />
        <ChatMessage messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} value={input} onChange={(e) => setInput(e.target.value)} />
        <div className='flex flex-row'>
          <div className="w-full p-4 bg-orange-100 border-t border-orange-300 flex justify-start rounded-b-lg">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => setShowSchedule((prev) => !prev)}
              >
                {showSchedule ? "스케줄표 숨기기" : "스케줄표 보이기"}
            </button>
          </div>
          <ChatCompleteButton Complete={complete} setComplete={setComplete} />
          <button onClick={handleLeaveChatRoom}>채팅방 나가기</button>
        </div>
      </div>
      <div className={`transition-all duration-300 ease-in-out transform
      ${showSchedule ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}`}>
        {showSchedule && <ScheduleContainer />}
      </div>
    </div>
  );
}

export default ChatPage;