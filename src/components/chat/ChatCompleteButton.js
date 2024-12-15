
const ChatCompleteButton = ({ Complete, setComplete }) => {
  return (
    <div className="w-full p-4 bg-orange-100 border-t border-orange-300 flex justify-end rounded-b-lg">
      <button
        onClick={setComplete}
        disabled={Complete}
        className={`px-4 py-2 rounded-md ${
          Complete
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        {Complete ? "거래 완료 대기 중" : "거래 완료"}
      </button>
    </div>
  );
};

export default ChatCompleteButton;
