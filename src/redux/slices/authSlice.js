import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../api/axiosInstance';

const initialState = {
  isAuthenticated: false,
  userEmail: null,
  memberId: null,
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
        throw new Error('응답 데이터가 없습니다.');
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
        memberId: response.data.result.memberId // 또는 실제 필드명
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.userEmail = null;
      state.memberId = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.userEmail = action.payload.userEmail;
      state.memberId = action.payload.memberId;
      state.error = null;
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
        state.memberId = action.payload.memberId;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        console.log('로그인 rejected 상태. error:', action.payload);
        state.loading = false;
        state.error = action.payload || '로그인 실패';
      });
  }
});

export const { logout, loginSuccess, setError } = authSlice.actions;
export default authSlice.reducer;