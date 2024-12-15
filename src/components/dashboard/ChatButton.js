// 채팅 알림, 리뷰 알림을 보여주는 컴포넌트
// 채팅 화면으로 이동할 수 있는 컴포넌트
// src/components/dashboard/ChatButton.js
import { Link } from "react-router-dom";

function ChatButton() {
  return (
    <Link to={'/chat/user'} className="text-gyoguma-dark hover:text-gyoguma">
      채팅
    </Link>
  );
}

export default ChatButton;