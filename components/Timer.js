import React, {} from 'react';
import { View, Text,  } from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledIcon = styled(Ionicons);

export const Timer = () => (
    <StyledView className='bg-offblack border-2 border-outline rounded-3xl text-offwhite px-10 py-2 justify-center'>
        <StyledText className='text-[25px] font-bold text-center text-offwhite'>Today:&ensp;00:01:23</StyledText>
        <StyledText className='text-[25px] font-bold text-center text-offwhite'>Week:&ensp;00:01:23</StyledText>
    </StyledView>
)