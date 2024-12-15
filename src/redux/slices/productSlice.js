import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "../../api/axiosInstance";
import initialState from "./productInitialState"

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async ({ categoryId }, { rejectWithValue }) => {
    try {
      const firstPageResponse = await axiosInstance.get('/products/?page=1');

      if (firstPageResponse.data.isSuccess) {
        const { totalPage } = firstPageResponse.data.result;
        let allProducts = [...firstPageResponse.data.result.productList];

        for(let page = 2; page <= totalPage; page++) {
          const response = await axiosInstance.get(`/products/?page=${page}`);
          if (response.data.isSuccess) {
            allProducts = [...allProducts, ...response.data.result.productList];
          }
        }

        // 각 상품의 이미지 정보를 함께 가져오기
        const productsWithImages = await Promise.all(allProducts.map(async (product) => {
          try {
            const imageResponse = await axiosInstance.get(`/products/${product.productId}/images`);
            if (imageResponse.data.isSuccess) {
              return {
                ...product,
                images: imageResponse.data.result.images || []
              };
            }
            return product;
          } catch (error) {
            console.error('Image fetch error:', error);
            return product;
          }
        }));

        return {
          products: productsWithImages,
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
      // 상품 정보와 이미지 정보를 동시에 가져오기
      const [productResponse, imageResponse] = await Promise.all([
        axiosInstance.get(`/products/${id}`),
        axiosInstance.get(`/products/${id}/images`)
      ]);

      if (productResponse.data.isSuccess) {
        return {
          ...productResponse.data.result,
          images: imageResponse.data.isSuccess ? imageResponse.data.result.images : []
        };
      }
      return rejectWithValue(productResponse.data.message);
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
      state.currentCategory = action.payload;
      state.page = 1;
      state.hasMore = true;
      if (!state.categoryProducts[action.payload]) {
        state.categoryProducts[action.payload] = [];
      }
    },
    setPage: (state, action) => {
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
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
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