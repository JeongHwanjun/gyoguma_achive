import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../../api/axiosInstance';
import { loginSuccess } from '../../redux/slices/authSlice';

export const withAuth = (WrappedComponent) => {
  return function WithAuthComponent(props) {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.auth);

    useEffect(() => {
      const restoreSession = async () => {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!accessToken || !refreshToken) {
          alert('로그인이 필요한 서비스입니다.');
          navigate('/');
          return;
        }

        try {
          const responseID = await axiosInstance.get('/token/users');
          const userId = responseID.data.userId;
          const responseALL = await axiosInstance.get(`/members/${userId}`);
          
          const {name, email, rating, nickname} = responseALL.data.result;
          dispatch(loginSuccess({
            userId: userId,
            userName: name,
            userEmail: email,
            userRating: rating,
            userNickName: nickname,
            accessToken,
            refreshToken
          }));
        } catch (error) {
          console.error('Failed to restore session:', error);
          if (error.response?.status === 401) {
            localStorage.clear();
            navigate('/');
            return;
          }
        }
        setIsLoading(false);
      };

      if (!isAuthenticated) {
        restoreSession();
      } else {
        setIsLoading(false);
      }
    }, [dispatch, navigate, isAuthenticated]);

    if (isLoading) {
      return <div className="flex justify-center items-center h-screen">로딩중...</div>;
    }

    return <WrappedComponent {...props} />;
  };
}; 