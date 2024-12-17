import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../api/axiosInstance';

const initialState = {
  isAuthenticated: false,
  userEmail: null,
  userId: null,
  loading: false,
  error: null
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    console.log('1. login thunk 시작됨');
    try {
      console.log('2. API 호출 전:', credentials);
      const response = await axiosInstance.post('/auth/login', credentials);
      console.log('3. API 응답 전체:', response);
      console.log('4. response.data:', response.data);

      if (!response.data) {
        console.log('5-1. 응답 데이터가 없음');
          return rejectWithValue('응답 데이터 없습니다');
      }

      console.log('5-2. 토큰 추출 시도');
      const { accessToken, refreshToken } = response.data.result;
      console.log('6. 토큰:', { accessToken, refreshToken });

      console.log('7. 토큰 디코드 시도');
      const decodedToken = jwtDecode(accessToken);
      console.log('8. 디코드된 토큰:', decodedToken);

      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);

      // response.data의 구조를 파악하기 위한 로그
      console.log('9. response.data.result:', response.data.result);

      const userData = {
        userEmail: credentials.email,
        userId: response.data.result.userId // 또는 실제 필드명
      };

      console.log('10. 최종 userData:', userData);
      return userData;

    } catch (error) {
      console.log('ERROR 발생:', error);
      console.log('에러 응답:', error.response);
      return rejectWithValue(error.response?.data?.message || '로그인 실패');
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
    'auth/checkAuthStatus',
    async (_, { rejectWithValue }) => {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      if (!accessToken || !refreshToken) {
        throw new Error('No tokens found');
      }

      try {
        const decodedToken = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;
        console.log("decondedToken : ",decodedToken)

        if (decodedToken.exp < currentTime) {
          // 토큰이 만료된 경우
          const response = await axiosInstance.post('/auth/refresh', {
            refreshToken
          });

          const { accessToken: newAccessToken } = response.data.result;
          localStorage.setItem('access_token', newAccessToken);

          return {
            ...decodedToken,
            accessToken: newAccessToken,
            refreshToken
          };
        }

        
        return {
          userEmail: decodedToken.email,
          userId: decodedToken.userId,
          accessToken,
          refreshToken
        };
      } catch (error) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        throw error;
      }
    }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userId : null,
    userEmail : null,
    userName : null,
    userNickName : null,
    userRating : null,
    accessToken: null,
    refreshToken : null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    loginSuccess(state, action) {
      state.userId = action.payload.userId;
      state.userEmail = action.payload.userEmail;
      state.userName = action.payload.userName;
      state.userNickName = action.payload.userNickName;
      state.userRating = Math.round(action.payload.userRating);
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.userId = null;
      state.userEmail = null;
      state.userName = null;
      state.userNickName = null;
      state.userRating = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.userEmail = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        console.log('로그인 pending 상태');
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('로그인 fulfilled 상태. payload:', action.payload);
        state.loading = false;
        state.isAuthenticated = true;
        state.userEmail = action.payload.userEmail;
        state.userId = action.payload.userId;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        console.log('로그인 rejected 상태. error:', action.payload);
        state.loading = false;
        state.error = action.payload || '로그인 실패';
      })
        // checkAuthStatus cases 추가
        .addCase(checkAuthStatus.pending, (state) => {
          state.loading = true;
        })
        .addCase(checkAuthStatus.fulfilled, (state, action) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.userEmail = action.payload.userEmail || state.userEmail;
          state.userId = action.payload.userId || state.userId;
          state.accessToken = action.payload.accessToken || state.accessToken;
          state.refreshToken = action.payload.refreshToken || state.refreshToken;
        })
        .addCase(checkAuthStatus.rejected, (state) => {
          state.loading = false;
          state.isAuthenticated = false;
          Object.assign(state, initialState);
        });

  }
});

export const { logout, loginSuccess, setError } = authSlice.actions;
export default authSlice.reducer;