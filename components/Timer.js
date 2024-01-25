import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableHighlight } from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledIcon = styled(Ionicons);
const StyledImage = styled(Image);
const StyledTouchableHighlight = styled(TouchableHighlight);

export const Timer = () => {
    const [dailyCount, setDailyCount] = useState(false);
    const [weeklyCount, setWeeklyCount] = useState(false);
    const [allTimeCount, setAllTimeCount] = useState(false);

    // TODO: collect permissions from user settings (database and / or local?)

    if (!dailyCount) {
        setDailyCount(true);
    }

    if (!weeklyCount) {
        setWeeklyCount(true);
    }

    if (!allTimeCount) {
        setAllTimeCount(true);
    }

    const [isAlternateText, setIsAlternateText] = useState(false);
    const [seconds, setSeconds] = useState(0);

    const handlePress = () => {
        setIsAlternateText((prevIsAlternateText) => !prevIsAlternateText);
    };

    var daily = "00 : 00 : 00";
    var weekly = "00 : 00 : 00";
    var allTime = "00 : 00 : 00";


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
        return `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // TODO: add timer to local storage, and pull local storage daily timer / weekly timer / all timer

    daily = formatTime(seconds);
    weekly = formatTime(seconds);
    allTime = formatTime(seconds);


    return (
        <StyledTouchableHighlight className='bg-offblack rounded-3xl text-offwhite px-5 py-2 justify-center w-[300px]' onPress={handlePress}>
            <>
                {dailyCount ?
                    <StyledView className='flex flex-row py-1'>
                        <StyledImage source={require('../assets/timers/calendar-day.png')} className="w-[40px] h-[40px] absolute top-[1px]"/>
                        <StyledText className='text-[30px] font-bold text-center text-offwhite w-full left-5'>
                            {isAlternateText ? 'Daily Usage' : daily}
                        </StyledText>
                    </StyledView>
                : null}
                {weeklyCount ?
                    <StyledView className='flex flex-row py-1'>
                        <StyledImage source={require('../assets/timers/calendar-week.png')} className="w-[40px] h-[40px] absolute top-[1px]"/>
                        <StyledText className='text-[30px] font-bold text-center text-offwhite w-full left-5'>
                            {isAlternateText ? 'Weekly Usage' : weekly}
                            </StyledText>
                    </StyledView>
                : null}
                {allTimeCount ?                    
                    <StyledView className='flex flex-row py-1'>
                        <StyledIcon name="infinite" size={40} color="#FFFBFC" className="w-[40px] h-[40px] absolute top-[1px]"/>
                        <StyledText className='text-[30px] font-bold text-center text-offwhite w-full left-5'>
                            {isAlternateText ? 'All Usage' : allTime}
                        </StyledText>
                    </StyledView>
                : null}
            </>
        </StyledTouchableHighlight>
    );
};