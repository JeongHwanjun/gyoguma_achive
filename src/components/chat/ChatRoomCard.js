// 채팅방 컴포넌트
// 메시지 입력창, 이미지 전송?
// 거래 완료 버튼 포함(클릭시 Rating 컴포넌트 표시)
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const ChatRoomCard = ({ room }) => {
  const { userId } = useSelector((state) => state.auth)
  const otherUserId = Number(room.buyer) === userId ? room.seller : room.buyer // 상대방 ID. 현재 사용자 ID와 다른 것을 취함.
  const [otherUser, setOtherUser] = useState({
    nickName : '',
    rating : null,
  })

  useEffect(() => {
    const fetchOtherUser = async () => {
      const response = await axiosInstance.get(`/members/${otherUserId}`)
      setOtherUser({nickName : response.data.result.nickname, rating : Math.round(response.data.result.rating)})
    }

    fetchOtherUser()
  },[otherUserId])
  
  return (
    <Link
      to={`/chat/${room.roomId}`}
      className="block p-4 bg-white shadow-md rounded-md hover:bg-orange-50 transition"
    >
      <div className="flex items-center">
        <img
          src={room.product}
          alt={`${room.product} Avatar`}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h3 className="text-lg font-bold">{otherUser.nickName /* 실제론 판매자/구매자 구별해야함 */}</h3>
          <p className="text-sm text-gray-600 truncate">{room.message}</p>
        </div>
      </div>
      <p className="text-sm text-gray-400 text-right mt-2">{room.time}</p>
    </Link>
  );
};

export default ChatRoomCard;
