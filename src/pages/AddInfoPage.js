// src/pages/AddInfoPage.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import axios from "axios";

const AddInfoPage = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    studentNumber: '',
    phoneNumber: '',
    nickname: '',
    gender: 'MALE'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // URL에서 토큰 파라미터 추출
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      //await axiosInstance.post('/users/addInfo', userInfo);
      const response = await axios.post('http://localhost:8080/users/addInfo',userInfo ,{
        headers : {
          'Authorization' : `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type' : 'application/json'
        },
        withCredentials : 'include'
      })
      console.log(response)
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || '정보 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
  };

  // 학번 유효성 검사
  const validateStudentNumber = (value) => {
    return /^\d{9}$/.test(value); // 9자리 숫자
  };

  // 전화번호 유효성 검사
  const validatePhoneNumber = (value) => {
    return /^01[0-9]-\d{4}-\d{4}$/.test(value);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          추가 정보 입력
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          서비스 이용을 위해 추가 정보를 입력해주세요.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                이름
              </label>
              <input
                type="text"
                name="name"
                value={userInfo.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                학번
              </label>
              <input
                type="text"
                name="studentNumber"
                value={userInfo.studentNumber}
                onChange={handleChange}
                required
                pattern="\d{9}"
                title="학번은 9자리 숫자여야 합니다"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                9자리 숫자로 입력해주세요
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                전화번호
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={userInfo.phoneNumber}
                onChange={handleChange}
                required
                pattern="01[0-9]-\d{4}-\d{4}"
                title="010-0000-0000 형식으로 입력해주세요"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                예시: 010-1234-5678
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                닉네임
              </label>
              <input
                type="text"
                name="nickname"
                value={userInfo.nickname}
                onChange={handleChange}
                required
                maxLength={20}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                성별
              </label>
              <select
                name="gender"
                value={userInfo.gender}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="MALE">남성</option>
                <option value="FEMALE">여성</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? '처리중...' : '제출'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddInfoPage;