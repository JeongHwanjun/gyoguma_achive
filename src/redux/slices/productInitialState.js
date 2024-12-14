const initialState = {
  categoryProducts: {
    'all': [],
    '1': [],  // 전공서적
    '2': [],  // 운동용품
    '3': [],  // 의약품
    '4': [],  // 생필품
    '5': [],  // 전자기기
    '6': [],  // 의류/신발/악세사리
    '7': [],  // 심부름
    '8': []   // 기타
  },
  currentCategory: 'all',
  searchWord : '',
  sortCriteria : 'date',
  sortDirection : 'asc',
  loading: false,
  error: null,
  hasMore: true,
  totalPages: 0,
  totalElements: 0
};

export default initialState;