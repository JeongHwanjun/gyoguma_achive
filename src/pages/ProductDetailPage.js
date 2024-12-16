import React, {useCallback, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import { Link } from "react-router-dom";
import {fetchProductById, clearCurrentProduct} from "../redux/slices/productSlice";
import ImageCarousel from "../components/product/ImageCarousel";
import axiosInstance from "../api/axiosInstance";

const categories = {
    1: "전공서적",
    2: "운동용품",
    3: "의약품",
    4: "생필품",
    5: "전자기기",
    6: "의류/신발/악세사리",
    7: "심부름",
    8: "기타",
};

const locations = {
    1: {name: "AI공학관", image: "/images/locations/AI.jpg"}, // 이미지 없음
    2: {name: "중앙도서관", image: "/images/locations/CentralLibrary.jpg"},
    3: {name: "가천관", image: "/images/locations/GachonHall.jpg"}, // 이미지 없음
    4: {name: "파스쿠찌", image: "/images/locations/Pascucci.jpg"},
    5: {name: "스타벅스앞", image: "/images/locations/StarBucks.jpg"},
};

function ProductDetailPage() {
    const {productId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSeller, setIsSeller] = useState(false);

    const currentProduct = useSelector(state => state.product.currentProduct);
    const loading = useSelector(state => state.product.loading);
    const error = useSelector(state => state.product.error);
    const {userId, userEmail} = useSelector(state => state.auth)


    useEffect(() => {
        // 맨 위로 스크롤
        window.scrollTo(0, 0);
        // ID가 유효한지 확인
        if (!productId) {
            console.error("Invalid product ID");
            return;
        }
        dispatch(fetchProductById(productId));

        // Cleanup function
        return () => {
            //dispatch(clearCurrentProduct());
        };
    }, [dispatch, productId]);

    // 현재 사용자가 buyer인지 seller인지 파악
    useEffect(() => {
        if(userEmail === currentProduct?.memberInfo?.email) setIsSeller(true)
        else setIsSeller(false)
    },[currentProduct, userEmail])

    const createOrGetChatRoom = async () => {
        const buyerId = isSeller ? null : userId
        console.log('buyerId : ',buyerId)
        try {
            const existRoomResponse = await axiosInstance.get(`/chat/buyer/${buyerId}`)
            const existRooms = existRoomResponse.data
            const existingRoom = existRooms?.find(
                (room) =>
                    room.buyer === buyerId && room.product === productId
            );
            //채팅방이 이미 있는가?
            if (existingRoom) {
                //채탕방이 있다면 그 채팅방으로 이동
                return existingRoom.roomId
            }
            // 채팅방이 없다면 새로 생성
            // /members/products/{productId} 를 통해 sellerId를 받아올 수 있음.
            const sellerIdResponse = await axiosInstance.get(`/members/products/${productId}`)
            const sellerId = sellerIdResponse.data.userId
            // 받아온 데이터를 기반으로 신규 채팅방 생성
            const createRoomResponse = await axiosInstance.post("/chat", {
                buyer: buyerId,
                seller: sellerId,
                product: productId,
                senderId: buyerId,
            });

            // 새로 생성된 roomId 반환
            return createRoomResponse.data.roomId;
        } catch (error) {
            console.error("Error while creating or fetching chat room:", error);
            throw error;
        }
    }

    const moveToChat = async () => {
        try {
            const roomId = await createOrGetChatRoom()
            navigate(`/chat/${roomId}`)
        } catch (e) {
            console.error('채팅방 이동 실패 : ', error)
        }
    }

    const deleteProduct = useCallback(async () => {
        try{
            const response = await axiosInstance.delete(`/products/${productId}`)
            if(response.isSuccess) console.log('상품 삭제 성공')
            navigate('/')
        } catch(e) {
            console.error(e)
        }
    },[navigate, productId])

    if (loading) {
        return <div className="flex justify-center items-center h-screen">로딩중...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">에러: {error}</div>;
    }

    if (!currentProduct) {
        return <div className="flex justify-center items-center h-screen">상품을 찾을 수 없습니다.</div>;
    }


    return (
        <div className="container mx-auto p-6">
            {/* 전체를 감싸는 흰색 컨테이너 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                {/* 제목과 기본 정보 섹션 */}
                <div className="border-b pb-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        {currentProduct.productInfo.title}
                    </h1>
                    <div className="flex justify-between items-center">
                        <div className="text-xl font-semibold text-green-600">
                            {new Intl.NumberFormat('ko-KR', {
                                style: 'currency',
                                currency: 'KRW'
                            }).format(currentProduct.productInfo.price)}
                        </div>
                        <div className="flex items-center space-x-4">
            <span className="px-3 py-1.5 bg-gray-100 rounded-full text-gray-600">
              {categories[currentProduct.productInfo.categoryId] || "미분류"}
            </span>
                            <span className="text-gray-500">
              {new Date(currentProduct.productInfo.createdAt).toLocaleDateString()}
            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ImageCarousel images={currentProduct.images} />

                    {/* 오른쪽: 정보 섹션 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-gray-600 space-y-4">
                            {/* 판매자 정보 */}
                            <p className="text-lg pb-2 border-b">{`판매자: ${currentProduct.memberInfo.name}`}</p>

                            {/* 거래 장소 */}
                            <div className="border-b pb-4">
                                <div className="text-lg mb-2">
                                    <span className="font-medium">거래장소:</span>
                                    <span className="px-3 py-1.5 bg-gray-100 rounded-full ml-2">
                                        {locations[currentProduct.productInfo.locationId]?.name || "위치 정보 없음"}
                                    </span>
                                </div>
                                <div className="w-full h-[300px] rounded-lg overflow-hidden">
                                    <img
                                        src={locations[currentProduct.productInfo.locationId]?.image}
                                        alt={locations[currentProduct.productInfo.locationId]?.name}
                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            e.target.src = "/images/placeholder.jpg";
                                            e.target.onerror = null;
                                        }}
                                    />
                                </div>
                            </div>

                            {/* 버튼들 */}
                            {!isSeller && <button
                                className="w-full py-4 text-lg bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mt-4"
                                onClick={moveToChat}
                            >
                                채팅하기
                            </button>}
                            {isSeller && <>
                                <Link className="block w-full py-4 text-lg bg-green-600 text-center text-white rounded-lg hover:bg-green-700 transition-colors mt-6"
                                to={`/edit/${productId}`}>수정하기</Link>
                                <button className="w-full py-4 text-lg bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors mt-4"
                                onClick={deleteProduct}>삭제하기</button>
                            </>}
                        </div>
                    </div>
                </div>
            </div>

            {/* 상품 설명 섹션 */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b">
                    <div className="px-6 py-3 border-b-2 border-green-600 font-semibold inline-block">
                        상품정보
                    </div>
                </div>
                <div className="p-8">
                    <div className="min-h-[400px] whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {currentProduct.productInfo.description || "상품 설명이 없습니다."}
                    </div>
                </div>
            </div>
        </div>
    );
}
    export default ProductDetailPage;