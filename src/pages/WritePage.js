import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import ProductForm from '../components/Write/ProductForm'
import { useSelector } from 'react-redux';
import { withAuth } from '../components/utils/withAuth';

const WritePage = ({isEdit}) => {
  const authState = useSelector((state) => state.auth);
  const {currentProduct} = useSelector(state => state.product)
  const productInfo = currentProduct.productInfo
  const { userId, isAuthenticated } = authState;
  const productIdEdit = useParams()

  console.log(`isEdit : ${isEdit}`)
  const [formData, setFormData] = useState({
    memberId: userId,
    title: '',
    price: '',
    description: '',
    categoryId: 0,
    locationId: 0,
  });

  useEffect(() => {
    console.log('전체 Auth State:', authState);
  }, [authState]);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState({
    titleLength: 0,
    titleValid: false,
    priceValid: false,
    categoryValid: false,
    placeValid: false,
  });

  // 로그인 상태 변경 확인
  useEffect(() => 
    console.log('Auth state changed:', { isAuthenticated, userId: userId })
  , [isAuthenticated, userId]);

  // 수정/작성 여부 확인, 수정일 시 기본값 지정
  useEffect(() => {
    if(!isEdit){ // 작성일 경우 그냥 진행
      return
    }

    setFormData({
      memberId : userId,
      title : productInfo.title,
      price : productInfo.price,
      description : productInfo.description,
      categoryId : 2, // 임시로 지정하기, 추후 productInfo에 카테고리 정보 추가 요망
      locationId : productInfo.locationId,
    })
    setFeedback({
      titleLength: 6,
      titleValid: true,
      priceValid: true,
      categoryValid: true,
      placeValid: true,
    })
  },[isEdit, productInfo, userId])
  
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

      console.log('memberId:', userId);

      // 서버가 기대하는 정확한 데이터 형식으로 변환
      const productData = {
        title: formData.title,
        price: Number(formData.price),
        description: formData.description,
        categoryId: Number(formData.categoryId),
        locationId: Number(formData.locationId),
        memberId: userId // userId를 숫자로 변환
      };
      const response = await axiosInstance.post('/products/', productData);

      console.log('상품 등록 데이터:', productData);
      console.log('상품 등록 응답:', response);
      console.log('memberId:', userId);
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
      const errorData = error.response.data;

      if (errorData.result.includes("givenDate")){
        throw new Error('오늘 찍은 사진이 아닙니다.');

      }
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

  const onEdit = async (e) => {
    e.preventDefault();

    if (!feedback.priceValid || !feedback.titleValid ||
      !feedback.categoryValid || !feedback.placeValid ||
      selectedFiles.length === 0) {
      alert('제출 내용을 확인해 주세요.');
      return;
    }

    try {
      const productData = {
        title: formData.title,
        price: Number(formData.price),
        description: formData.description,
        categoryId: Number(formData.categoryId),
        locationId: Number(formData.locationId),
        memberId: userId // userId를 숫자로 변환
      };
      const response = await axiosInstance.patch(`/products/${productIdEdit}`, productData)
      const productId = response.data.result.productId
      
      console.log('patch on : ', productId)

      if (productId) {
        await uploadImages(productId);
        navigate(`/product/${productId}`);
      }
    } catch (error) {
      alert(error.message);
      console.error('제품 수정 에러:', error);
    }
  }

  return (
    <ProductForm
      calculateProgress={calculateProgress}
      onSubmit={(isEdit ? onEdit : onSubmit)}
      setSelectedFiles={setSelectedFiles}
      handleChange={handleChange}
      formData={formData}
      feedback={feedback}
    />
  );
};

export default withAuth(WritePage);