// 채팅 입력 컴포넌트
// 텍스트 입력, 이미지 첨부?
const ChatInput = ({value, onChange, onSendMessage}) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    if(value.trim()){
      onSendMessage(value)
    }
  }
  return (
    <form className="flex items-center p-4 bg-orange-100 border-t border-orange-300 rounded-b-lg" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="메세지를 입력하세요..."
        value={value}
        onChange={onChange}
        className="flex-grow p-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      <button
        type='submit'
        className="ml-4 px-2 py-1.5 bg-orange-400 text-white rounded-md hover:bg-orange-500 transition"
      >
        <img className='w-[32px] h-[30px]' src='/images/enter.png' alt='보내기' />
      </button>
    </form>
  );
};

export default ChatInput;
