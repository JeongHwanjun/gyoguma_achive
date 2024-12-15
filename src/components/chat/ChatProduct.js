import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

// 채팅과 관련있는 상품을 표시하는 컴포넌트
const ChatProduct = ({ product }) => {
  return (
    <div className="flex items-center p-4 bg-orange-50 border-b border-orange-300">
      <img
        src={product.image || "https://via.placeholder.com/64x64"}
        alt={product.title}
        className="w-16 h-16 rounded-md mr-4"
      />
      <div>
        <h4 className="text-base font-semibold">{product.title}</h4>
        <p className="text-red-500 font-bold">{product.price}</p>
      </div>
    </div>
  );
};

export default ChatProduct;
