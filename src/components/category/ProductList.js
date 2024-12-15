// ProductList.js
import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProductCard } from './ProductCard';
import { fetchProducts, fetchProductsByCategory } from './productSlice';

const ProductList = () => {
  const dispatch = useDispatch();
  const {
    products,
    loading,
    error,
    currentCategory,
    categoryProducts,
    hasMore
  } = useSelector((state) => state.product);

  //무한 스크롤 구현
  // 마지막 아이템의 ref를 저장할 변수
  const observer = useRef();

  // IntersectionObserver를 사용해 마지막 상품이 화면에 보이면
  // 추가 데이터를 불러옴
  const lastProductRef = useCallback(node => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        // 카테고리별 또는 전체 상품 추가 로딩
        if (currentCategory && currentCategory !== 'all') {
          dispatch(fetchProductsByCategory({
            categoryId: currentCategory,
            page: Math.ceil((categoryProducts[currentCategory]?.length || 0) / 10) + 1
          }));
        } else {
          dispatch(fetchProducts(Math.ceil(products.length / 10) + 1));
        }
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, currentCategory, products.length, categoryProducts, dispatch]);

  //초기 데이터 로딩
  useEffect(() => {
    //카테고리가 변경될 때마다 해당 카테고리 상품 불러옴
    if (currentCategory && currentCategory !== 'all') {
      dispatch(fetchProductsByCategory({ categoryId: currentCategory, page: 1 }));
    } else {
      dispatch(fetchProducts(1));
    }
  }, [dispatch, currentCategory]);

  // 로딩 초기 상태 처리
  if (loading && !products.length && !categoryProducts[currentCategory]?.length) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center py-8">로딩 중...</div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center py-8 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  // 표시할 상품 목록 결정
  const displayProducts = currentCategory && currentCategory !== 'all'
    ? categoryProducts[currentCategory] || []
    : products;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-green-800">최근 등록된 상품</h2>

      {/* 상품 목록 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {displayProducts.map((product, index) => (
          <div
            key={product.id}
            ref={index === displayProducts.length - 1 ? lastProductRef : null}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {displayProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          등록된 상품이 없습니다
        </div>
      )}

      {loading && (
        <div className="text-center py-4 text-gray-500">
          추가 상품 로딩 중...
        </div>
      )}
    </div>
  );
};

export default ProductList;