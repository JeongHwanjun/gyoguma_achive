// src/components/Write/ProductForm.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../api/index';
import axiosInstance from '../api/axiosInstance';
import ProductForm from '../components/Write/ProductForm'
import { useSelector } from 'react-redux';

const WritePage = () => {
  // 상품 정보를 제어하는 state
  const [formData, setFormData] = useState({
    memberId: 1,
    title: '',
    price: '',
    description: '',
    categoryId: 0,
    locationId: 0,
  });

  // 이미지 정보를 제어하는 state
  const [selectedFiles, setSelectedFiles] = useState([])

  // 사용자 정보
  const {userEmail, isAuthenticated} = useSelector((state) => state.auth)
  console.log(isAuthenticated)
  useEffect(() => {
    if(!isAuthenticated){
      alert('로그인이 필요한 서비스입니다.')
      navigate('/')
    }
  })

  // 피드백 정보를 관리하는 상태입니다
  const [feedback, setFeedback] = useState({
    titleLength: 0,
    titleValid: false,
    priceValid: false,
    categoryValid : false,
    placeValid : false,
  });

  const navigate=useNavigate()

  // 입력 필드 값이 변경될 때 호출되는 함수입니다
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title' || name === 'description'){
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: Number(value)
      }))
    }
    

    // 실시간 유효성 검사를 수행합니다
    if (name === 'title') {
      setFeedback(prev => ({
        ...prev,
        titleLength: value.length,
        titleValid: value.length >= 5 && value.length <= 100
      }));
    }

    if (name === 'price') {
      const numberValue = Number(value);
      setFeedback(prev => ({
        ...prev,
        priceValid: numberValue > 0 && numberValue <= 10000000
      }));
    }

    if (name === 'categoryId') {
      const numberCategory = Number(value)
      setFeedback(prev => ({
        ...prev,
        categoryValid : numberCategory > 0 && numberCategory <= 4
      }))
    }

    if (name === 'locationId') {
      const numberPlace = Number(value)
      setFeedback(prev => ({
        ...prev,
        placeValid : numberPlace > 0
      }))
    }
  };

  // 폼 작성 진행률을 계산하는 함수입니다
  const calculateProgress = () => {
    let progress = 0;
    if (feedback.titleValid) progress += 20;
    if (feedback.priceValid) progress += 20;
    if (feedback.categoryValid) progress += 20;
    if (feedback.placeValid) progress += 20;
    if (selectedFiles.length > 0) progress += 20;
    return progress;
  };

  const onSubmit = async (e) => {
    e.preventDefault()
    if(!feedback.priceValid || !feedback.titleValid || !feedback.categoryValid || !feedback.placeValid || selectedFiles.length === 0){
      // 조건 불만족 알림 보내기
      alert('제출 내용을 확인해 주세요.')
    }    

    
    const imageData = new FormData()
    selectedFiles.forEach((file) => {
      imageData.append('images', file); // 키가 'images'여야 정상적으로 받을 수 있음
    });
    
    try{
      // 글 등록
      const response = await API.product.create(formData)
      const productId = response.data.result.productId
      // 이미지 등록
      const imageResponse = await axiosInstance.post(
        `/products/${productId}/images`,
        imageData,
        {
          headers : {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      console.log('이미지 업로드 성공 : ', imageResponse)
      // 작성된 페이지로 이동시키기
      navigate(`/product/${productId}`)
    } catch(err) {
      alert('제출에 문제가 발생했습니다.')
      console.log(err)
    }
  }
  return (
    <ProductForm 
    calculateProgress={calculateProgress}
    onSubmit={onSubmit}
    setSelectedFiles={setSelectedFiles}
    handleChange={handleChange}
    formData={formData}
    feedback={feedback}
    />
  );
};

export default WritePage;