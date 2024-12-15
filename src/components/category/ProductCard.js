import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // product 객체에서 필요한 정보들을 구조분해할당
  const {
    productId,
    title,
    price,
    imageUrl,
    status,
    nickname,
    createdAt
  } = product;

  // 간단한 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) return `${diffDays}일 전`;
    if (diffHours > 0) return `${diffHours}시간 전`;
    if (diffMinutes > 0) return `${diffMinutes}분 전`;
    return '방금 전';
  };

  const statusLabel = {
    'ON_SALED': '판매중',
    'RESERVED': '예약중',
    'SOLD_OUT': '판매완료'
  };

  // 기본 이미지 URL
  const defaultImageUrl = 'data:image/svg+xml;charset=UTF-8,%3csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3e%3crect width="200" height="200" fill="%23CCCCCC"/%3e%3ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23666666"%3e이미지 없음%3c/text%3e%3c/svg%3e';

  return (
    // 상품 상세 페이지로 이동하는 링크
    <Link to={`/product/${productId}`} className="block">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="relative aspect-square">
          <img
            src={imageUrl || defaultImageUrl}
            alt={title}
            className="w-full h-full object-cover rounded-t-lg"
            onError={(e) => {
              if (e.target.src !== defaultImageUrl) {
                e.target.src = defaultImageUrl;
              }
            }}
          />
          {status && status !== 'ON_SALED' && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
              {statusLabel[status] || status}
            </div>
          )}
        </div>
        {/*상품 정보 영역 */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-1 truncate">
            {title || '제목 없음'}
          </h3>
          <p className="text-lg font-bold text-gray-900 mb-1">
            {typeof price === 'number' ? `${price.toLocaleString()}원` : '가격 정보 없음'}
          </p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{nickname || '판매자 정보 없음'}</span>
            <span>{createdAt ? formatDate(createdAt) : ''}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;