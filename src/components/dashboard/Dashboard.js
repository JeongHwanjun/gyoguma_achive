//프로필, 채팅, 로그인/로그아웃 버튼을 포함하는 컴포넌트
//src/components/dashboard/Dashboard.js// src/components/dashboard/Dashboard.js
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { logout } from "../../redux/slices/authSlice";
import UserProfile from "./UserProfile";
import AuthButton from "./AuthButton";
import ChatButton from "./ChatButton";
import React, { useEffect } from "react";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, userEmail } = useSelector(state => state.auth);

  console.log(userEmail)

  // 디버깅을 위한 상태 출력 추가
  useEffect(() => {
    console.log('Auth State:', { isAuthenticated, userEmail });
  }, [isAuthenticated, userEmail]);

  const handleLogout = async () => {
    try {
      // 서버에 로그아웃 요청
      await axiosInstance.post('/logout');
      // 성공적으로 로그아웃 후 state 변경 - email, accessToken, refreshToken 삭제, isAuthenticated = false
      dispatch(logout())
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="flex items-center gap-6">
      {isAuthenticated ? (
        <>
          <UserProfile user={userEmail}/>
          <ChatButton />
          <button
          onClick={handleLogout}
          className="text-gyoguma-dark hover:text-gyoguma"
          >
            로그아웃
          </button>
        </>
      ) : (
        <AuthButton />
      )}
    </nav>
  );
}

export default Dashboard;