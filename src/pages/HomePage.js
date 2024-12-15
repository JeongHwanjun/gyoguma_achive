
// HomePage.js 또는 ProductListPage.js
import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProductCard from '../components/category/ProductCard';
import {
  setCurrentCategory,
  fetchProductsByCategory,
  setPage,
  setSortDirection,
  setSortCriteria
} from '../redux/slices/productSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const observer = useRef();
  const [sortDir, setSortDir] = useState(true)
  const [sortCri, setSortCri] = useState('date')
  const {
    categoryProducts,
    currentCategory,
    loading,
    hasMore,
    page,
    totalPages,
    error
  } = useSelector(state => state.product);

  const currentProducts = categoryProducts[currentCategory] || [];

  const categories = [
    { id: 'all', name: '전체' },
    { id: '1', name: '전공서적' },
    { id: '2', name: '운동용품' },
    { id: '3', name: '의약품' },
    { id: '4', name: '생필품' },
    { id: '5', name: '전자기기' },
    { id: '6', name: '의류/신발/악세사리' },
    { id: '7', name: '심부름' },
    { id: '8', name: '기타' }
  ];

  const lastProductElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && page < totalPages) {
        dispatch(setPage(page + 1));
        dispatch(fetchProductsByCategory({ categoryId: currentCategory, page: page + 1 }));
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, page, totalPages, dispatch, currentCategory]);

  const handleCategoryChange = (categoryId) => {
    dispatch(setCurrentCategory(categoryId));
    dispatch(fetchProductsByCategory({ categoryId, page: 1 }));
  };

  useEffect(() => {
    const strSortDirection = sortDir ? 'desc' : 'asc'
    
    dispatch(setSortDirection(strSortDirection))
    dispatch(setSortCriteria(sortCri))
    dispatch(fetchProductsByCategory({ categoryId : currentCategory, page: 1 }));
  },[currentCategory, dispatch, sortCri, sortDir])

  useEffect(() => {
    dispatch(fetchProductsByCategory({ categoryId: currentCategory, page: 1 }));
  }, [currentCategory, dispatch]);

  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-red-500">{error}</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* 필터 및 검색 섹션 */}
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors
                  ${currentCategory === category.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          <div className="relative">
            {/* Select와 Button 통합 */}
            <select
              onChange={(e) => setSortCri(e.target.value)}
              className="appearance-none cursor-pointer px-4 py-2 pr-10 border rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none"
              value={sortCri}
            >
              <option value="date">날짜순</option>
              <option value="price">가격순</option>
            </select>

            {/* 화살표 버튼 */}
            <button
              onClick={() => setSortDir((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none"
            >
              <img
                src="/images/arrow.png"
                alt="direction"
                className={`w-5 h-5 transition-transform ${sortDir ? 'rotate-90' : '-rotate-90'}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 상품 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentProducts.map((product, index) => {
          if (!product) return null;

          // 고유한 key 생성을 위해 productId와 index를 조합
          const uniqueKey = `${product.productId}-${index}`;

          if (currentProducts.length === index + 1) {
            return (
                <div ref={lastProductElementRef} key={uniqueKey}>
                  <ProductCard product={product} />
                </div>
            );
          }
          return (
              <div key={uniqueKey}>
                <ProductCard product={product} />
              </div>
          );
        })}
      </div>


      {/* 로딩 표시 */}
      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      )}

      {/* 데이터 없음 표시 */}
      {!loading && currentProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          등록된 상품이 없습니다.
        </div>
      )}

      {/* 맨 위로 스크롤 버튼 */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
      <Link
        to="/write"
        className='fixed bottom-8 right-24 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors'
        >글쓰기</Link>
    </div>
  );
};

export default HomePage;
