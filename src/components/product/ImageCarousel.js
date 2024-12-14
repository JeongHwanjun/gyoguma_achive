import React, { useState } from 'react';

const ImageCarousel = ({ images = [], onThumbnailClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const chevronWidth = 40;

  const handlePrevious = () => {
    setCurrentIndex(current =>
      current === 0 ? images.length - 1 : current - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(current =>
      current === images.length - 1 ? 0 : current + 1
    );
  };

  return (
    <div className="w-full">
      {/* 메인 이미지 */}
      <div className="relative px-16 aspect-square">
        <div className="w-full h-full flex justify-center items-center bg-gray-100 rounded-lg">
          {images.length > 0 ? (
            <img
              src={images[currentIndex]}
              alt={`상품 이미지 ${currentIndex + 1}`}
              className="max-w-full max-h-96 object-contain"
            />
          ) : (
            <span className="text-gray-400">이미지 없음</span>
          )}
        </div>

        {/* 이전/다음 버튼 */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
            >
              <img src="/images/arrow.png" alt="이전" className="w-10 h-10 rotate-180" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              <img src="/images/arrow.png" alt="다음" className="w-10 h-10" />
            </button>
          </>
        )}
      </div>

      {/* 썸네일 목록 */}
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-2 px-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 
                ${currentIndex === index ? 'border-green-500' : 'border-transparent'}`}
            >
              <img
                src={image}
                alt={`썸네일 ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;