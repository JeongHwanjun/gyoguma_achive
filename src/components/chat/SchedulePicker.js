import React, { useCallback, useState } from "react";

const SchedulePicker = ({
  selectedTimes, setSelectedTimes,
  availableTimes,
  handleSubmit,
  days=[], hours,
}) => {
  // 드래그 상태 관리
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState(null);

  const handleMouseDown = useCallback((day, hour) => {
    setIsDragging(true);
    setDragMode((prev) => {
      // 드래그 모드 : 추가/제거 모드
      const isSelected = selectedTimes[day]?.includes(hour) ?? false;
      return isSelected ? "remove" : "add";
    });
    // 클릭 시 시간 추가/제거
    setSelectedTimes((prev) => ({
      ...prev,
      [day]: selectedTimes[day]?.includes(hour)
        ? prev[day].filter((h) => h !== hour)
        : [...(prev[day] || []), hour],
    }));
  },[selectedTimes, setSelectedTimes])

  const handleMouseEnter = useCallback((day, hour) => {
    if (!isDragging) return; // 드래그 중이 아니면 무시

    setSelectedTimes((prev) => ({
      ...prev,
      [day]: dragMode === "remove"
        ? prev[day]?.filter((h) => h !== hour) || []
        : [...new Set([...(prev[day] || []), hour])],
    }));
  },[isDragging, dragMode, setSelectedTimes])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragMode(null); // 드래그 모드 초기화
  },[])

  const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
  };

  return (
    <div className="">
      <div className="grid grid-cols-8 gap-2" onMouseUp={handleMouseUp}>
        <div className="col-span-1"></div>
        {days?.map((day, i) => (
          <div
            key={i}
            className={`text-center p-2 select-none ${
              isWeekend(day) ? "bg-red-200" : "bg-gray-200"
            }`}
          >
            {(day.getMonth()+1).toString()}-{day.getDate().toString()}
          </div>
        ))}
        {hours?.map((hour) => (
          <React.Fragment key={hour}>
            <div className="text-center py-2 select-none bg-gray-300">{hour}</div>
            {days.map((day) => {
              const date = day.toISOString().split("T")[0];
              const isSelected =
                selectedTimes[date]?.includes(hour) ?? false;
              const isAvailable =
                availableTimes[date]?.includes(hour) ?? false;
              const isHighlighted = isSelected && isAvailable;

              return (
                <div
                  key={`${date}-${hour}`}
                  className={`border h-10 select-none ${
                    isHighlighted
                      ? "bg-green-300"
                      : isSelected
                      ? "bg-blue-300"
                      : isAvailable
                      ? "bg-yellow-300"
                      : "bg-white"
                  }`}
                  onMouseDown={() => handleMouseDown(date, hour)}
                  onMouseEnter={() => handleMouseEnter(date, hour)}
                ></div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        onClick={handleSubmit}
      >
        제출하기
      </button>
    </div>
  );
};

export default SchedulePicker;
