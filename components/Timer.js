import React, { useState, useEffect } from 'react';
import { View, Text, Image  } from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledIcon = styled(Ionicons);
const StyledImage = styled(Image);

export const Timer = () => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(seconds => seconds + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // TODO: add timer to local storage, and pull local storage daily timer / weekly timer / all timer

    return (
        <StyledView className='bg-offblack border-2 border-outline rounded-3xl text-offwhite px-10 py-2 justify-center'>
            <StyledView className='flex flex-row'>
                <StyledImage source={require('../assets/timers/calendar-day.png')} className="w-[30px] h-[30px] top-[1px]"/>
                <StyledText className='text-[25px] font-mono font-bold text-center text-offwhite'>&nbsp;{formatTime(seconds)}</StyledText>
            </StyledView>
            <StyledView className='flex flex-row'>
                <StyledImage source={require('../assets/timers/calendar-week.png')} className="w-[30px] h-[30px] top-[1px]"/>
                <StyledText className='text-[25px] font-bold text-center text-offwhite'>&nbsp;{formatTime(seconds)}</StyledText>
            </StyledView>
            <StyledView className='flex flex-row'>
                <StyledIcon name="infinite" size={30} color="#FFFBFC" className="w-[30px] h-[30px] top-[1px]"/>
                <StyledText className='text-[25px] font-bold text-center text-offwhite'>&nbsp;{formatTime(seconds)}</StyledText>
            </StyledView>
        </StyledView>
    );
};