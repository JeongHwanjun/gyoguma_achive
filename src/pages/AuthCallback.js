// src/pages/AuthCallback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-xl">인증 처리중...</div>
    </div>
  );
};

export default AuthCallback;