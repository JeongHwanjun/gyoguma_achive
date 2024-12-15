// 채팅 페이지
import React, { useCallback, useEffect, useState } from 'react';
import ChatInput from '../components/chat/ChatInput';
import ChatMessage from '../components/chat/ChatMessage';
import ChatParticipants from '../components/chat/ChatParticipants';
import ChatProduct from '../components/chat/ChatProduct'
import ChatCompleteButton from '../components/chat/ChatCompleteButton';
import ScheduleContainer from '../components/chat/ScheduleContainer';
import RatingModal from '../components/chat/Rating';
import { useNavigate, useParams } from 'react-router-dom';
import { API } from '../api/index';
import axiosInstance from '../api/axiosInstance';
import { connect, sendMessage, leaveChatRoom, enterChatRoom as enterChatRoomSocket, disconnect } from '../services/socket';
import { useSelector } from 'react-redux';

function ChatPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [complete, setComplete] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [stompClient, setStompClient] = useState(null)
  const [otherUser, setOtherUser] = useState({}) // nickname, rating만 갖고 있음
  const [otherUserId, setOtherUserId] = useState(null) // id를 갖고 있음
  const [currentRoom, setCurrentRoom] = useState({})
  const [product, setProduct] = useState({})
  const [selectedTimes, setSelectedTimes] = useState({});
  const [isBuyer, setIsBuyer] = useState(false)
  const {roomId} = useParams()
  const navigate = useNavigate()
  const {userId, userNickName, isAuthenticated} = useSelector((state) => state.auth)
  
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

  // 채팅방에 연결. socket을 연결, 구독하고 입장 메세지를 publish합니다.
  useEffect(() => {
    // 로그인이 필요한 서비스임
    if(!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.')
      navigate('/')
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
      if(stompClient){
        handleLeaveChatRoom()
        disconnect(roomId)
      }
    }
  },[roomId, userId, userNickName, isAuthenticated, stompClient, navigate, handleLeaveChatRoom])

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
    setInput('')
  },[roomId, stompClient, userId, userNickName])

  // 기초적인 정보를 가져옵니다(현재 채팅방, 사용자, 상품)
  useEffect(() => {
    const fetchInformation = async () => {
      try {
        const roomsResponse = await axiosInstance.get(`/chat/user/${userId}`);
        const room = roomsResponse.data.find(room => room.roomId === roomId);
  
        if (!room) {
          console.error("Room not found for this roomId.");
          return;
        }
        // 자신이 buyer인지 seller인지 기록 -> complete 여부 판단
        
        // 상대방의 ID 기록
        const otherUserId = Number(room.buyer) === userId ? room.seller : room.buyer
        const otherUserInfo = await axiosInstance.get(`/members/${otherUserId}`);
        console.log(otherUserInfo)
        const productInfo = await axiosInstance.get(`/products/${room.product}`)

        setIsBuyer(Number(room.buyer) === userId)
        setOtherUserId(otherUserId)
        setCurrentRoom(room); // 상태 업데이트
        setOtherUser(otherUserInfo.data.result); // 상대방 정보 업데이트
        setProduct(productInfo.data.result.productInfo) // 상품 정보 업데이트
      } catch (e) {
        console.error('Error on Fetching Data : ', e);
      }
    };
  
    fetchInformation();
  }, [roomId, userId]);

  const onSubmit = async (rating) => {
    try{
      const response = await axiosInstance.post(`/reviews/${otherUserId}`, {starRating : rating})
      console.log(response)
      console.log('채팅방을 삭제합니다')
      await axiosInstance.delete(`/chat/${roomId}`)
      navigate('/')
    } catch(e) {
      console.error('review Submit Failed : ',e)
    }
  }

  return (
    <div className='flex flex-row justify-center space-x-16 p-16'>
      <div className="flex flex-col w-96 h-[724px] mx-auto border border-orange-300 rounded-lg bg-orange-50">
        <ChatParticipants otherUser={otherUser} />
        <ChatProduct product={product} />
        <ChatMessage messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} value={input} onChange={(e) => setInput(e.target.value)} />
        <div className='flex flex-row'>
          <div className="w-full p-4 bg-orange-100 border-t border-orange-300 flex justify-start rounded-b-lg">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => setShowSchedule((prev) => !prev)}
              >
                {showSchedule ? "스케줄표 OFF" : "스케줄표 ON"}
            </button>
          </div>
          {/* 구매자만 상대방을 평가할 수 있음 */}
          {isBuyer && <ChatCompleteButton Complete={complete} setComplete={setComplete} />}
        </div>
      </div>
      <div className={`transition-all duration-300 ease-in-out transform
      ${showSchedule ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}`}>
        {showSchedule && <ScheduleContainer roomId={roomId} selectedTimes={selectedTimes} setSelectedTimes={setSelectedTimes}/>}
      </div>
      {complete && <RatingModal onSubmit={onSubmit} />}
    </div>
  );
}

export default ChatPage;