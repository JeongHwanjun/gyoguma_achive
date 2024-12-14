import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Layout from "./components/layout/Layout";

import HomePage from "./pages/HomePage";
//import AuthPage from "./pages/AuthPage";
import CategoryPage from "./pages/CategoryPage";
import ChatMainPage from "./pages/ChatMainPage";
import ChatPage from "./pages/ChatPage";
import MyPage from "./pages/MyPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductListPage from "./pages/ProductListPage";
import AuthCallback from './pages/AuthCallback';
//import ChatRoomList from './pages/ChatRoomList';
//import ChatRoom from './pages/ChatRoom';
import AddInfoPage from "./pages/AddInfoPage";
import WritePage from "./pages/WritePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* 홈 화면 */}
          <Route index element={<HomePage />} />

          {/* 인증 관련 */}
          {/*<Route path="/auth" element={<AuthPage />} />*/}
          <Route path="/users/addInfo" element={<AddInfoPage />} />
          <Route path="/users/addInfo" element={<AddInfoPage />} />

          {/* 상품 작성 관련 */}
          <Route path="/write" element={<WritePage />} />

          {/* 카테고리 및 상품 관련 */}
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />

          {/* 채팅 관련 라우트들을 계층적으로 구성 */}
          <Route path="/chat/user/:userId" element={<ChatMainPage />} />
          <Route path="/chat/:roomId" element={<ChatPage />} />
          {/* 마이페이지 */}
          <Route path="/mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;