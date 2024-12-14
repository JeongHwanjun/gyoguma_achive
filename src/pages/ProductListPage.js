import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/category/ProductCard';
import {
  setCurrentCategory,
  fetchProductsByCategory
} from '../redux/slices/productSlice';

const ProductListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    categoryProducts,
    currentCategory,
    loading,
    error
  } = useSelector(state => state.product);

  // 실제 카테고리 데이터에 맞게 매핑 수정
  const categoryMapping = {
    '전체': 'all',
    '전공서적': '1',
    '운동용품': '2',
    '의약품': '3',
    '생필품': '4',
    '전자기기': '5',
    '의류/신발/악세사리': '6',
    '심부름': '7',
    '기타': '8'
  };

  const currentProducts = categoryProducts[currentCategory] || [];

  useEffect(() => {
    const categoryId = categoryMapping[currentCategory];
    dispatch(fetchProductsByCategory({ categoryId, page: 1 }));
  }, [dispatch, currentCategory]);

  const handleCategoryChange = (category) => {
    dispatch(setCurrentCategory(category));
  };

  const handleSort = (sortOrder) => {
    console.log('Sort order:', sortOrder);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-red-500">{error}</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {Object.keys(categoryMapping).map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  currentCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <select
            onChange={(e) => handleSort(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="latest">최신순</option>
            <option value="price_asc">가격 낮은순</option>
            <option value="price_desc">가격 높은순</option>
          </select>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/write')}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            상품 등록
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProducts.map(product => (
          <ProductCard
            key={product.productId}
            product={product}
          />
        ))}
      </div>

      {currentProducts.length === 0 && !loading && (
        <div className="text-center py-10 text-gray-500">
          등록된 상품이 없습니다.
        </div>
      )}
    </div>
  );
};

export default ProductListPage;