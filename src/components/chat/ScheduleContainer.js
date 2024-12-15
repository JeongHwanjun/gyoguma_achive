import SchedulePicker from "./SchedulePicker";
import axiosInstance from "../../api/axiosInstance";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const ScheduleContainer = ({roomId, selectedTimes, setSelectedTimes}) => {
    const [availableTimes, setAvailableTimes] = useState({});
    const {userId} = useSelector(state => state.auth)

    // 금일로부터 7일, 09시~21시
    const today = useMemo(() => new Date(),[])
    const days = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            return date;
        });
    },[today])

    const hours = useMemo(() => {
        return Array.from({ length: 13 }, (_, i) => 9 + i);
    }, []);

    const fetchAvailableTime = useCallback(async () => {
        try{
            const response = await axiosInstance.get(`/overlapping/${roomId}`)
            const responseTimes = response.data
            const updatedTimes = responseTimes.reduce((acc, available) => {
                acc[available.date] = available.overlappingTimes;
                return acc;
            }, {});
            setAvailableTimes(updatedTimes)

        } catch (e) {
            console.error('fetch failed : ',e)
            setAvailableTimes({})
        }
    },[roomId])

    useEffect(() => {
        fetchAvailableTime()
    },[fetchAvailableTime])

    const handleSubmit = useCallback(async () => {
        console.log("Selected times submitted: ", selectedTimes);
        try{
            const response = await axiosInstance.post(`/schedule/${roomId}`,{
                roomId : roomId,
                senderId : userId,
                time : selectedTimes
            })
            await fetchAvailableTime()
        } catch (e) {
            console.error("submit failed : ",e)
        }
    },[selectedTimes, roomId, userId, fetchAvailableTime])

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