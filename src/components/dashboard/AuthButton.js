import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useDispatch } from 'react-redux';
import { loginSuccess, setError } from '../../redux/slices/authSlice'

function AuthButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // URL의 토큰 파라미터 체크
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      // 토큰 저장
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);

      // URL 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);

      // 토큰을 받아온 후, 해당 토큰을 인증에 사용해 현재 유저 이메일을 받아옴
      const getUserEmail = async () => {
        try {
          const response = await axiosInstance.get('/token/users');
          const memberId = response.data.userId;
          console.log('User ID:', memberId);
          // dispatch로 전역에서 이용할 수 있도록 redux state 갱신
          dispatch(loginSuccess({ memberId, accessToken, refreshToken }))
          // 이후 원하는 컴포넌트에서 useSelector로 언제든 로그인 정보 이용 가능
        } catch (error) {
          console.error('Failed to fetch user email:', error);
          dispatch(setError(error))
        }
      }

      getUserEmail()

      // 홈으로 리다이렉트 (또는 원하는 페이지로)
      //navigate('/');
    }
  }, [navigate, dispatch]);

  const handleLogin = async () => {
    try {
      window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleLogin}
        className="text-gyoguma-dark hover:text-gyoguma"
      >
        로그인
      </button>
    </div>
  );
}

export default AuthButton;