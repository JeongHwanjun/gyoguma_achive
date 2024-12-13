// 개별 메시지(텍스트, 이미지 메시지) 컴포넌트
// 시간 표시, 읽음 상태(?)
import React from "react";
import { useSelector } from "react-redux";
// 유저 정보를 가져와야함.

const ChatMessage = ({ messages }) => {
  const validMessages = Array.isArray(messages) ? messages : []
  const {userId} = useSelector((state) => state.auth)
  console.log(validMessages)
  if (validMessages.length === 0) console.log('Invalid Messages Received : ', messages)
  return (
    <div className="flex flex-col p-4 flex-grow overflow-y-auto bg-orange-50 scrollbar-thin scrollbar-corner-transparent scrollbar-thumb-gray-200 scrollbar-track-transparent">
      {validMessages?.map((message, index) => (
        <div
          key={index}
          className={`mb-3 p-3 rounded-lg shadow-md ${
            message.senderId === userId
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
