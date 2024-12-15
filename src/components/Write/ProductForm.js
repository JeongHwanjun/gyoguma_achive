// 상품 등록/수정 폼
// 이미지 업로드, 카테고리, 위치, 시간 등 선택
import React from 'react';
import InputField from '../common/InputField';
import DropDownSelector from '../common/DropDownSelector';
import TextArea from '../common/TextArea';
import ImageUploader from '../common/ImageUploader';
import Button from '../common/Button';
import WritePlace from './WritePlace';

export default function ProductForm({
  calculateProgress,
  onSubmit,
  setSelectedFiles,
  handleChange,
  formData,
  feedback,
}) {
  

  const categories = [
    {value : '0', text : '선택'},
    {value : '1', text : '전자기기'},
    {value : '2', text : '가구'},
    {value : '3', text : '도서'},
    {value : '4', text : '의류'}
  ]

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-green-800">상품 등록</h1>
      
      {/* 진행 상태 표시 바 */}
      <div className="mb-8">
        <div className="flex justify-between mb-2 text-sm text-green-700">
          <span>기본 정보</span>
          <span>상세 정보</span>
          <span>완료</span>
        </div>
        <div className="h-2 bg-green-100 rounded-full">
          <div 
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{width: `${calculateProgress()}%`}}
          />
        </div>
      </div>

      <form className="space-y-6" onSubmit={onSubmit}>
        {/* 사진 입력 필드 */}
        <ImageUploader setSelectedFiles={setSelectedFiles}/>
        {/* 상품명 입력 필드 */}
        <div>
          <label className="block text-sm font-medium text-green-800">
            상품명
            <span className="text-green-600 text-sm ml-2">
              ({feedback.titleLength}/100자)
            </span>
          </label>
          <InputField
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm 
              ${feedback.titleValid ? 'border-green-300' : 'border-red-500'}
              focus:outline-none focus:ring-2 focus:ring-green-500`}
            placeholder="상품명을 입력해주세요 (5자 이상)"
          />
          {!feedback.titleValid && (
            <p className="mt-1 text-sm text-red-500">
              상품명은 5자 이상 100자 이하로 입력해주세요
            </p>
          )}
        </div>

        {/* 카테고리 선택 필드 */}
        <div>
          <label className="block text-sm font-medium text-green-800">
            카테고리
          </label>
          <DropDownSelector
          name='categoryId'
          value={formData.categoryId}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-green-300 rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-green-500"
          options={categories}
          />
        </div>

        {/* 가격 입력 필드 */}
        <div>
          <label className="block text-sm font-medium text-green-800">
            가격
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <InputField
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border rounded-md
                ${feedback.priceValid ? 'border-green-300' : 'border-red-500'}
                focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="가격을 입력해주세요"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-green-600">원</span>
            </div>
          </div>
          {!feedback.priceValid && (
            <p className="mt-1 text-sm text-red-500">
              올바른 가격을 입력해주세요 (1원 ~ 1000만원)
            </p>
          )}
        </div>

        {/* 상품 설명 입력 필드 */}
        <div>
          <label className="block text-sm font-medium text-green-800">
            상품 설명
          </label>
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-green-300 rounded-md shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="상품 설명을 입력해주세요"
          />
        </div>

        {/* 장소 입력 필드 */}
        <div>
          <label className="block text-sm font-medium text-green-800">
              거래장소
          </label>
          <WritePlace 
          name='locationId'
          placeIndex={formData.locationId} 
          onChange={handleChange}/>
        </div>
        

        {/* 도움말 섹션 */}
        <div className="bg-green-50 p-4 rounded-md mt-8 border border-green-200">
          <h3 className="font-medium text-green-800">📝 상품 등록 도움말</h3>
          <ul className="mt-2 text-sm text-green-700 space-y-1">
            <li>• 상품명은 구매자가 쉽게 이해할 수 있게 작성해주세요</li>
            <li>• 정확한 가격을 입력해주세요</li>
            <li>• 상품 설명은 상세히 작성할수록 좋습니다</li>
          </ul>
        </div>

        {/* 제출 버튼 */}
        <div className="mt-6">
          <Button
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 
              transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={onSubmit}
          >
            상품 등록하기
          </Button>
        </div>
      </form>
    </div>
  );
}