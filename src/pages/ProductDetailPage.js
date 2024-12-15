import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductById, clearCurrentProduct } from "../redux/slices/productSlice";
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
  1: "AI공학관",
  2: "중앙도서관",
  3: "가천관",
  4: "파스쿠찌",
  5: "스타벅스앞",
};

function ProductDetailPage() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();

  const currentProduct = useSelector(state => state.product.currentProduct);
  const loading = useSelector(state => state.product.loading);
  const error = useSelector(state => state.product.error);
  const { userId } = useSelector(state => state.auth)

  useEffect(() => {
    // ID가 유효한지 확인
    if (!productId) {
      console.error("Invalid product ID");
      return;
    }
    dispatch(fetchProductById(productId));

    // Cleanup function
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, productId]);

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };
  
  const createOrGetChatRoom = async () => {
    const buyerId = userId // 상품을 보는 사용자가 구매자임
    try{
      const existRoomResponse = await axiosInstance.get(`/chat/buyer/${buyerId}`)
      const existRooms = existRoomResponse.data
      const existingRoom = existRooms?.find(
        (room) =>
          room.buyer === buyerId && room.product === productId
      );
      //채팅방이 이미 있는가?
      if(existingRoom) {
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
      navigate(`/chat/transaction:${roomId}`)
    } catch(e) {
      console.error('채팅방 이동 실패 : ', error)
    }
  }

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 왼쪽 영역: 이미지 섹션 */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <img
              src={currentProduct.images?.[selectedImage]?.storedFileName || "https://via.placeholder.com/400x400"}
              alt={currentProduct.title}
              className="w-full aspect-square object-cover rounded-lg"
            />
          </div>
          {/* 썸네일 이미지들 */}
          {currentProduct.images && currentProduct.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {currentProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className={`border-2 rounded-lg overflow-hidden ${
                    selectedImage === index ? "border-green-500" : "border-gray-200"
                  }`}
                >
                  <img
                    src={image.storedFileName || "https://via.placeholder.com/80x80"}
                    alt={`${currentProduct.title} ${index + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-4">
          {/* 상품 정보 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-600 space-y-4">
              <p className="text-lg">{`판매자: ${currentProduct.nickname}`}</p>

              <div className="flex items-center space-x-3 text-lg">
                <span className="font-medium">카테고리:</span>
                <span className="px-3 py-1.5 bg-gray-100 rounded-full">
                  {categories[currentProduct.categoryId] || "미분류"}
                </span>
              </div>
              
              <div className="flex items-center space-x-3 text-lg">
                <span className="font-medium">거래장소:</span>
                <span className="px-3 py-1.5 bg-gray-100 rounded-full">
                  {locations[currentProduct.locationId] || "위치 정보 없음"}
                </span>
              </div>

              <p className="text-lg">{`등록일: ${new Date(currentProduct.createdAt).toLocaleDateString()}`}</p>
            </div>
          </div>

          {/* 채팅하기 버튼 */}
          <button
            className="w-full py-4 text-lg bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            onClick={moveToChat}>
            채팅하기
          </button>
        </div>
      </div>

      {/* 하단 상품 정보 */}
      <div className="mt-12 bg-white rounded-lg shadow-md">
        <div className="border-b">
          <div className="flex">
            <div className="px-6 py-3 border-b-2 border-green-600 font-semibold">
              상품정보
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="min-h-[400px] whitespace-pre-wrap">
            {currentProduct.description || "상품 설명이 없습니다."}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;