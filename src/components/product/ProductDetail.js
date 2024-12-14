import { useState } from 'react';
import Button from '../common/Button.js';
import ImageCarousel from './ImageCarousel';
import ProductPlace from './ProductPlace'
const ProductDetail = (props) => {
  console.log("전체 props:", props);

  const {
    imageURLs=['/images/logo.png'],
    title='title',
    price='price',
    userInfo='userInfo',
    description='description',
    categoryId,
    locationId,
  } = props;

  console.log("categoryId:", categoryId, "locationId:", locationId);
  const [tabIndex, setTabIndex] = useState(0);

  // categoryId를 카테고리 이름으로 변환하는 함수
  const getCategoryName = (id) => {
    const categories = {
      1: '전공서적',
      2: '운동용품',
      3: '의약품',
      4: '생필품',
      5: '전자기기',
      6: '의류/신발/악세사리',
      7: '심부름',
      8: '기타'
    };
    return categories[id] || '미분류';
  };

  // locationId를 실제 위치명으로 변환하는 함수
  const getLocationName = (id) => {
    const locations = {
      1: 'AI공학관',
      2: '중앙도서관',
      3: '가천관',
      4: '파스쿠찌',
      5: '스타벅스앞'
    };
    return locations[id] || '위치 정보 없음';
  };

  const onTabClick = (tabNum) => {
    setTabIndex(tabNum)
  }
  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 왼쪽 영역: 이미지 섹션 */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            {/* 메인 이미지 영역 */}
            <div className="aspect-square bg-gray-100 rounded-lg">
              <ImageCarousel images={imageURLs} />
            </div>
          </div>
          {/* 썸네일 이미지 목록 */}
          {imageURLs.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {imageURLs.map((image, index) => (
                <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`썸네일 ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        {/* 오른쪽 영역: 상품 정보 섹션 */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">{title}</h1>
              <div className="text-xl font-semibold">{price}</div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <span className="font-medium">카테고리:</span>
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                    {getCategoryName(categoryId)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <span className="font-medium">거래장소:</span>
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                    {getLocationName(locationId)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <span className="font-medium">판매자:</span>
                  <span>{userInfo}</span>
                </div>
              </div>
              <Button isLink={false} className="w-full">
                채팅하기
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 상세 정보 탭 */}
      <div className="mt-12 bg-white rounded-lg shadow-md">
        <div className="border-b">
          <div className="flex">
            <button
              className={
                tabIndex === 0
                  ? 'px-6 py-3 border-b-2 border-green-600 font-semibold'
                  : 'px-6 py-3'
              }
              onClick={() => onTabClick(0)}
            >
              상품정보
            </button>
            <div className="px-6 py-3">
              거래장소: {getLocationName(locationId)}
            </div>
          </div>
        </div>
        <div className="p-8">
          {description}
        </div>
      </div>
  );
};

export default ProductDetail