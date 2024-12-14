import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../api/index';
import axiosInstance from '../api/axiosInstance';
import ProductForm from '../components/Write/ProductForm';
import { useSelector } from 'react-redux';

const WritePage = () => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    categoryId: 0,
    locationId: 0,
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();

  // Redux에서 현재 로그인된 사용자 정보 가져오기
  const { isAuthenticated, userEmail, memberId } = useSelector((state) => state.auth);
  console.log('useSelector memberId:', memberId); // 추가

  const [feedback, setFeedback] = useState({
    titleLength: 0,
    titleValid: false,
    priceValid: false,
    categoryValid: false,
    placeValid: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      console.log('Auth state changed:' , { isAuthenticated, userEmail, memberId });
      alert('로그인이 필요한 서비스입니다.');
      navigate('/');
    }
  }, [isAuthenticated,  userEmail, memberId, navigate]);


  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, userEmail, memberId });
  }, [isAuthenticated, userEmail, memberId]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'title' || name === 'description') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: Number(value)
      }));
    }

    // 유효성 검사 로직
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
      const numberCategory = Number(value);
      setFeedback(prev => ({
        ...prev,
        categoryValid: numberCategory >= 1 && numberCategory <= 8
      }));
    }
    if (name === 'locationId') {
      const numberPlace = Number(value);
      setFeedback(prev => ({
        ...prev,
        placeValid: numberPlace > 0
      }));
    }
  };

  const calculateProgress = () => {
    let progress = 0;
    if (feedback.titleValid) progress += 20;
    if (feedback.priceValid) progress += 20;
    if (feedback.categoryValid) progress += 20;
    if (feedback.placeValid) progress += 20;
    if (selectedFiles.length > 0) progress += 20;
    return progress;
  };
  const createProduct = async () => {
    try {
      if (!isAuthenticated) {
        throw new Error('로그인이 필요합니다.');
      }

      if (!formData.title || !formData.price || !formData.description || !formData.categoryId || !formData.locationId) {
        throw new Error('모든 필드를 입력해주세요.');
      }

      console.log('memberId:', memberId);

      // 서버가 기대하는 정확한 데이터 형식으로 변환
      const productData = {
        title: formData.title,
        price: Number(formData.price),
        description: formData.description,
        categoryId: Number(formData.categoryId),
        locationId: Number(formData.locationId),
        memberId: memberId // memberId를 숫자로 변환
      };
      const response = await axiosInstance.post('/products/', productData);

      console.log('상품 등록 데이터:', productData);
      console.log('상품 등록 응답:', response);
      console.log('memberId:', memberId);
      return response.data.result.productId;
    } catch (error) {
      console.error('상품 등록 에러:', error.response?.data || error);
      throw new Error(error.response?.data?.message || '상품 등록에 실패했습니다.');
    }
  };
  const uploadImages = async (productId) => {
    try {
      const imageData = new FormData();

      selectedFiles.forEach((file) => {
        imageData.append('images', file);
        imageData.append('originFileName', file.name);
        imageData.append('size', file.size);
      });

      const response = await axiosInstance.post(
        `/products/${productId}/images`,
        imageData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000
        }
      );

      console.log('이미지 업로드 성공:', response);
      return response;
    } catch (error) {
      console.error('이미지 업로드 에러:', error.response?.data || error);
      throw new Error('이미지 업로드에 실패했습니다.');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!feedback.priceValid || !feedback.titleValid ||
      !feedback.categoryValid || !feedback.placeValid ||
      selectedFiles.length === 0) {
      alert('제출 내용을 확인해 주세요.');
      return;
    }

    try {
      const productId = await createProduct();

      if (productId) {
        await uploadImages(productId);
        navigate(`/product/${productId}`);
      }
    } catch (error) {
      alert(error.message);
      console.error('전체 제출 에러:', error);
    }
  };

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