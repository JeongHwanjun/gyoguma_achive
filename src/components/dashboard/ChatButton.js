// 채팅 알림, 리뷰 알림을 보여주는 컴포넌트
// 채팅 화면으로 이동할 수 있는 컴포넌트
// src/components/dashboard/ChatButton.js
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function ChatButton() {
  const {userId} = useSelector(state => state.auth)
  const [hasNewChat, setHasNewChat] = useState(false)
  const [prevChatCount, setPrevChatCount] = useState(0)
  const [isStarting, setIsStarting] = useState(true)

  useEffect(() => {
    const checkNewChat = async () => {
      try{
        const response = await axiosInstance.get(`/chat/seller/${userId}`)
        const chatCount = response.data?.length ? response.data.length : 0
        // 처음 체크한다면 무시함(초기화)
        if(isStarting){
          setHasNewChat(false)
          setIsStarting(false)
        } else if(chatCount > prevChatCount){
          setHasNewChat(true)
        }
        setPrevChatCount(chatCount)

        

        console.log(chatCount)
      } catch(e) {
        console.error('Fetch chat data Failed : ',e)
      }
    }
    const Interval = setInterval(checkNewChat, 5000)
    
    return () => clearInterval(Interval)
  },[userId, prevChatCount, isStarting])

  const resetAlarm = () => {
    setHasNewChat(false)
  }
  return (
    <Link to={'/chat/user'} className="relative text-gyoguma-dark hover:text-gyoguma" onClick={resetAlarm}>
      채팅
      {hasNewChat && <span className="absolute w-2 h-2 bg-red-500 rounded-full"></span>}
    </Link>
  );
}

export default ChatButton;