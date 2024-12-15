import DropDownSelector from "../common/DropDownSelector"

// 거래 장소를 드롭다운으로 입력하고, 그에따라 이미지로 표시하는 컴포넌트.
const WritePlace = (props) => {
    const {placeIndex, onChange, name} = props

    const pictureURLs=[
        '',
        'AI.jpg',
        'CentralLibrary.jpg',
        'Gachon.jpg',
        'Pascucci.jpg',
        'StarBucks.jpg'
    ]
    const placeNames=[
        '',
        'AI공학관',
        '중앙도서관',
        '가천관',
        '파스쿠찌',
        '스타벅스앞',
    ]
    const places = [
        {value : '0', text : '선택'},
        {value : '1', text : 'AI공학관'},
        {value : '2', text : '중앙도서관'},
        {value : '3', text : '가천관'},
        {value : '4', text : '파스쿠찌'},
        {value : '5', text : '스타벅스앞'}
    ]

    return (
        <>
        <DropDownSelector
        name={name}
        value={placeIndex}
        options={places}
        onChange={onChange}/>
        <div className='flex flex-col justify-center items-center'>
            <span className='text-2xl p-3'>{placeNames[Number(placeIndex)]}</span>
            <img className='max-w-64 max-h-64 object-fill' src={`/images/locations/${pictureURLs[Number(placeIndex)]}`} alt='place'/>
        </div>
        </>
        
        
    )
}

export default WritePlace