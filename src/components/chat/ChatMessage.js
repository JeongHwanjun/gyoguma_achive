// 개별 메시지(텍스트, 이미지 메시지) 컴포넌트
// 시간 표시, 읽음 상태(?)
import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
// 유저 정보를 가져와야함.

const ChatMessage = ({ messages }) => {
  const validMessages = Array.isArray(messages) ? messages : [];
  const { userId } = useSelector((state) => state.auth);
  const scrollRef = useRef(null);

  // 메시지가 추가될 때 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  if (validMessages.length === 0) console.log('Invalid Messages Received : ', messages)
  return (
    <div 
    ref={scrollRef}
    className="flex flex-col p-4 flex-grow overflow-y-auto bg-orange-50 scrollbar-thin scrollbar-corner-transparent scrollbar-thumb-gray-200 scrollbar-track-transparent">
      {validMessages?.map((message, index) => (
        <div
          key={index}
          className={`mb-3 p-3 rounded-lg shadow-md ${
            Number(message.senderId) === userId
              ? "bg-purple-100 self-end"
              : "bg-green-100 self-start"
          }`}
        >
          <span className="text-sm">{message.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatMessage;
