//productSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "../../api/axiosInstance";
import initialState from "./productInitialState"



export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async ({ categoryId }, { rejectWithValue }) => {
    try {
      // 모든 페이지의 상품을 가져오는 로직
      // 우선 1페이지를 가져와서 전체 페이지 수를 확인
      const firstPageResponse = await axiosInstance.get('/products/?page=1');

      if (firstPageResponse.data.isSuccess) {
        const { totalPage } = firstPageResponse.data.result;
        let allProducts = [...firstPageResponse.data.result.productList];

        // 2페이지부터 마지막 페이지까지 순차적으로 가져오기
        for(let page = 2; page <= totalPage; page++) {
          const response = await axiosInstance.get(`/products/?page=${page}`);
          if (response.data.isSuccess) {
            allProducts = [...allProducts, ...response.data.result.productList];
          }
        }

        return {
          products: allProducts,
        };
      }
      return rejectWithValue(firstPageResponse.data.message);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '상품 로드 실패');
    }
  }
);
export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      if (response.data.isSuccess) {
        return response.data.result;
      }
      return rejectWithValue(response.data.message);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '상품 조회 실패');
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    ...initialState,
    currentProduct: null,
  },
  reducers: {
    setCurrentCategory: (state, action) => {
      //카테고리 변경 시 상태 초기화
      state.currentCategory = action.payload;
      state.page = 1;
      state.hasMore = true;
      if (!state.categoryProducts[action.payload]) {
        state.categoryProducts[action.payload] = [];
      }
    },
    setPage: (state, action) => {
      //페이지 번호 설정
      state.page = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    setSearchWord: (state, action) => {
      state.searchWord = action.payload;
    },
    setSortCriteria: (state, action) => {
      state.sortCriteria = action.payload;
    },
    setSortDirection: (state, action) => {
      state.sortDirection = action.payload;
    },
  },
  extraReducers: (builder) => {
    //비동기 상태 처리
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        //로딩 시작
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        //데이터 로드 성공 / 카테고리별 상품 필터링 및 저장
        console.log('fetchProductByCategory fulfilled')
        state.loading = false;
        const { products, hasMore, totalPages, totalElements } = action.payload;

        // 카테고리별 필터링
        const filteredByCategory = state.currentCategory === 'all'
          ? products
          : products.filter(product =>
            product?.categoryId?.toString() === state.currentCategory
          );

        // 검색어 필터링
        const filteredBySearchWord = state.searchWord
          ? filteredByCategory.filter(product =>
              product.title?.toLowerCase().includes(state.searchWord?.toLowerCase())
            )
          : filteredByCategory;
        
        // 정렬
        const sorted = [...filteredBySearchWord].sort((a, b) => {
          const valueA = state.sortCriteria === 'price' ? a.price : new Date(a.createdAt);
          const valueB = state.sortCriteria === 'price' ? b.price : new Date(b.createdAt);
      
          if (state.sortDirection === 'asc') {
            return valueA > valueB ? 1 : -1;
          } else {
            return valueA < valueB ? 1 : -1;
          }
        });

        state.categoryProducts[state.currentCategory] = sorted;

        /*
        if (state.page === 1) {
          state.categoryProducts[state.currentCategory] = filteredBySearchWord;
        } else {
          state.categoryProducts[state.currentCategory] = [
            ...state.categoryProducts[state.currentCategory],
            ...filteredBySearchWord
          ];
        }
          */

        state.hasMore = hasMore;
        state.totalPages = totalPages;
        state.totalElements = totalElements;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        //에러 처리
        state.loading = false;
        state.error = action.payload || '상품 로드 실패';
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '상품 조회 실패';
        state.currentProduct = null;
      });
  }
});

export const {
  setCurrentCategory,
  setPage,
  setSearchWord,
  clearCurrentProduct,
  setSortCriteria,
  setSortDirection
} = productSlice.actions;

export default productSlice.reducer;