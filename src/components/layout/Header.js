// src/components/layout/Header.js
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Dashboard from "../dashboard/Dashboard";
import InputField from "../common/InputField";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { fetchProductsByCategory, setSearchWord } from "../../redux/slices/productSlice";

function Header() {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const { currentCategory } = useSelector(state => state.product)
  const [debouncedSearchText] = useDebounce(searchText, 200);

  const onSearchChange = useCallback(e => {
    setSearchText(e.target.value);
  }, []);

  useEffect(() => {
    dispatch(setSearchWord(debouncedSearchText))
    // 검색어를 통해 상품 목록 변경
    dispatch(fetchProductsByCategory({categoryId : currentCategory}))
  },[currentCategory, debouncedSearchText, dispatch])

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 max-sm:hidden">
            <img src="/images/logo.png" alt="교구마" className="h-10" />
            <span className="text-gyoguma-dark font-bold text-xl">교구마</span>
          </Link>

          <div className="flex-1 max-w-2xl mx-8">
            <InputField
              type='text'
              placeholder='검색'
              value={searchText}
              onChange={onSearchChange}
            />
          </div>

          <Dashboard />
        </div>
      </div>
    </header>
  );
}

export default Header;