
import React, { useState } from 'react';
const ImageUploader = (props) => {
    const [uploadImgUrls, setUploadImgUrls] = useState([]);
    const {setSelectedFiles} = props

    const onChangeImageUpload = (e) => {
        const { files } = e.target;
        const fileArray = Array.from(files);

        const newImgUrls = fileArray.map((file) => {
            const reader = new FileReader();
            return new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(newImgUrls).then((results) => {
            setUploadImgUrls((prevUrls) => [...prevUrls, ...results]);
        });

        setSelectedFiles((prevFiles) => [...prevFiles, ...fileArray]);
    };

    // 이미지 삭제 기능 추가
    const handleDeleteImage = (index) => {
        setUploadImgUrls((prev) => prev.filter((_, i) => i !== index));
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
      <div className="flex flex-col items-center gap-5 p-5 border-2 border-dashed border-gray-400 rounded-md max-w-4xl mx-auto bg-gray-100">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
              {uploadImgUrls.map((url, index) => (
                <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Uploaded ${index}`}
                      className="w-full h-full aspect-auto object-cover rounded-md border border-gray-300 hover:scale-110 transform transition duration-300"
                    />
                    <button
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                        ×
                    </button>
                </div>
              ))}
          </div>
          <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-200">
              <span>이미지 선택</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onChangeImageUpload}
                className="hidden"
              />
          </label>
      </div>
    );
};

export default ImageUploader;