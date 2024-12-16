import React, { useState } from "react";

const ImageCarousel = ({ images }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0); // 선택된 큰 이미지
    const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0); // 썸네일 시작 인덱스
    const thumbnailsToShow = 4; // 한 번에 보여줄 썸네일 개수

    // 현재 표시할 썸네일 배열
    const displayedThumbnails = images.slice(
        thumbnailStartIndex,
        thumbnailStartIndex + thumbnailsToShow
    );

    const handleThumbnailClick = (index) => {
        setSelectedImageIndex(index);
    };

    const handlePrevClick = () => {
        if (selectedImageIndex > 0) {
            const newIndex = selectedImageIndex - 1;
            setSelectedImageIndex(newIndex);

            // 썸네일 범위 조정
            if (newIndex < thumbnailStartIndex) {
                setThumbnailStartIndex((prev) => Math.max(0, prev - 1));
            }
        }
    };

    const handleNextClick = () => {
        if (selectedImageIndex < images.length - 1) {
            const newIndex = selectedImageIndex + 1;
            setSelectedImageIndex(newIndex);

            // 썸네일 범위 조정
            if (newIndex >= thumbnailStartIndex + thumbnailsToShow) {
                setThumbnailStartIndex((prev) =>
                    Math.min(images.length - thumbnailsToShow, prev + 1)
                );
            }
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            {/* 큰 이미지 표시 */}
            <div className="w-full max-w-lg">
                <img
                    src={images[selectedImageIndex].storedFileName}
                    alt={`Selected ${selectedImageIndex}`}
                    className="w-full h-[468px] rounded-lg object-contain"
                />
            </div>

            {/* 썸네일과 컨트롤 */}
            <div className="flex items-center space-x-2">
                {/* 이전 화살표 */}
                <button
                    onClick={handlePrevClick}
                    disabled={selectedImageIndex === 0}
                    className={`p-2 rounded-full border ${
                        selectedImageIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    ◀
                </button>

                {/* 썸네일 리스트 */}
                <div className="flex space-x-2 overflow-hidden">
                    {displayedThumbnails.map((thumbnail, index) => {
                        const actualIndex = thumbnailStartIndex + index;
                        return (
                            <button
                                key={actualIndex}
                                onClick={() => handleThumbnailClick(actualIndex)}
                                className={`border-2 rounded-md ${
                                    actualIndex === selectedImageIndex
                                        ? "border-green-500"
                                        : "border-gray-300"
                                }`}
                            >
                                <img
                                    src={thumbnail.storedFileName}
                                    alt={`Thumbnail ${actualIndex}`}
                                    className="w-20 h-20 object-cover"
                                />
                            </button>
                        );
                    })}
                </div>

                {/* 다음 화살표 */}
                <button
                    onClick={handleNextClick}
                    disabled={selectedImageIndex === images.length - 1}
                    className={`p-2 rounded-full border ${
                        selectedImageIndex === images.length - 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                    }`}
                >
                    ▶
                </button>
            </div>

            {/* 스크롤바 */}
            <div className="relative w-full max-w-lg h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="absolute h-full bg-green-500"
                    style={{
                        width: `${((selectedImageIndex + 1) / images.length) * 100}%`,
                        transition: "width 0.3s ease",
                    }}
                ></div>
            </div>
        </div>
    );
};

export default ImageCarousel;
