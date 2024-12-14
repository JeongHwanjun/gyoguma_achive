import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductById, clearCurrentProduct } from "../redux/slices/productSlice";
import axiosInstance from "../api/axiosInstance";

const categoryMap = {
  1: "전공서적",
  2: "운동용품",
  3: "의약품",
  4: "생필품",
  5: "전자기기",
  6: "의류/신발/악세사리",
  7: "심부름",
  8: "기타",
};

const statusMap = {
  "ON_SALED": "판매중",
  "RESERVED": "예약중",
  "SOLD_OUT": "판매완료",
};

function ProductDetailPage() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state 구조에 맞게 selector 수정
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
    console.log("Fetching product with ID:", productId); // 디버깅용
    dispatch(fetchProductById(productId));

    // Cleanup function
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, productId]);

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
              src={currentProduct.imageUrl || `https://via.placeholder.com/400x400`}
              alt={currentProduct.title}
              className="w-full aspect-square object-cover rounded-lg"
            />
          </div>
        </div>

        {/* 오른쪽 영역: 상품 정보 섹션 */}
        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">{currentProduct?.title}</h1>
              <div className="text-xl font-semibold">
                {currentProduct?.price?.toLocaleString()}원
              </div>
              <div className="text-gray-600">
                <p>판매자: {currentProduct?.nickname}</p>
                <p>상태: {currentProduct?.status ? statusMap[currentProduct.status] : "상태 없음"}</p>
              </div>
            </div>
          </div>

          {/* 구매 옵션 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">

              <div className="border-t pt-4">
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  구매하기
                </button>
                <button className="flex-1 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50"
                onClick={moveToChat}>
                  채팅하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 상세 정보 탭 */}
      <div className="mt-12 bg-white rounded-lg shadow-md">
        <div className="border-b">
          <div className="flex">
            <button className="px-6 py-3 border-b-2 border-green-600 font-semibold">
              상품정보
            </button>
            <button className="px-6 py-3">리뷰</button>
            <button className="px-6 py-3">문의</button>
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