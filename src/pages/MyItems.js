import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProductCard from '../components/category/ProductCard';
import {API} from '../api/index'

const MyItems = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({
        totalPage: 0,
        isFirst: true,
        isLast: true,
        totalElements: 0
    });

    const { user } = useSelector(state => state.auth);
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchMyProducts = async () => {
            try {
                setLoading(true);
                console.log('Fetching products for user:', user.id);
                const response = await API.product.getByMember(user.id, page);
                console.log('API response:', response);
                const data = response.data;


                if (data.isSuccess) {
                    setProducts(prev =>
                        page === 1 ? data.result.productList : [...prev, ...data.result.productList]
                    );
                    setPageInfo({
                        totalPage: data.result.totalPage,
                        isFirst: data.result.isFirst,
                        isLast: data.result.isLast,
                        totalElements: data.result.totalElements
                    });
                } else {
                    throw new Error(data.message || '상품을 불러오는데 실패했습니다.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id && accessToken) {
            fetchMyProducts();
        }
    }, [user?.id, accessToken, page]);

    const loadMore = () => {
        if (!pageInfo.isLast && !loading) {
            setPage(prev => prev + 1);
        }
    };

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">내 상품 관리</h1>
                <p className="text-gray-600 mt-2">
                    총 {pageInfo.totalElements}개의 상품이 등록되어 있습니다.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(product => (
                    <div key={product.productId}>
                        <ProductCard
                            product={{
                                ...product,
                                status: product.status === 'ON_SALED' ? '판매중' :
                                    product.status === 'RESERVED' ? '예약중' : '판매완료'
                            }}
                        />
                    </div>
                ))}
            </div>

            {loading && (
                <div className="flex justify-center my-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
            )}

            {!loading && products.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-4">등록된 상품이 없습니다.</p>
                    <Link
                        to="/write"
                        className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        상품 등록하기
                    </Link>
                </div>
            )}

            {!loading && !pageInfo.isLast && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={loadMore}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                        더 보기
                    </button>
                </div>
            )}

            <Link
                to="/write"
                className="fixed bottom-8 right-8 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </Link>
        </div>
    );
};

export default MyItems;