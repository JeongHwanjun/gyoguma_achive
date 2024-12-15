import SchedulePicker from "./SchedulePicker";
import axiosInstance from "../../api/axiosInstance";
import React, { useCallback, useEffect, useState } from "react";

const ScheduleContainer = ({roomId, selectedTimes, setSelectedTimes}) => {
    const [availableTimes, setAvailableTimes] = useState({});

    // 금일로부터 7일, 09시~21시
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        return date;
    });

    const hours = Array.from({ length: 13 }, (_, i) => 9 + i);

    useEffect(() => {
        const fetchAvailableTime = async () => {
            try{
                const response = await axiosInstance.get(`/chat/schedule/${roomId}`)
                setAvailableTimes(response.data.results.availableTimes)
            } catch (e) {
                console.error('fetch failed : ',e)
                setAvailableTimes({
                    '2024-12-15' : [9,10,11],
                    '2024-12-16' : [13,15,16],
                })
            }
        }
        fetchAvailableTime()
    },[roomId])

    const handleSubmit = useCallback(async () => {
        console.log("Selected times submitted: ", selectedTimes);
        // Example POST request
        try{
            const response = await axiosInstance.post(`/chat/schedule/${roomId}`, selectedTimes)
            setAvailableTimes(response.data.results.availableTimes)
        } catch (e) {
            console.error("submit failed : ",e)
        }
    },[selectedTimes, roomId])

    return (
        <div className='flex flex-col justify-center'>
            <SchedulePicker
            selectedTimes={selectedTimes} setSelectedTimes={setSelectedTimes}
            availableTimes={availableTimes}
            handleSubmit={handleSubmit}
            days={days} hours={hours}
            />
        </div>
        
    )
}

export default ScheduleContainer