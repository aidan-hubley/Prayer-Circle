import React, { useState, useRef } from 'react';
import {
	Text,
	View,
	Image,
	Pressable,
	TouchableOpacity,
	Animated
} from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { timeSince } from '../backend/functions';
import { writeData } from '../backend/firebaseFunctions';

const StyledImage = styled(Image);
const StyledIcon = styled(Ionicons);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledOpacity = styled(TouchableOpacity);
const StyledAnimatedView = styled(Animated.createAnimatedComponent(View));
const AnimatedImage = Animated.createAnimatedComponent(StyledImage);

export const Filter = () => {

	return (
		<StyledView className='absolute bottom-[-105px] w-full h-[300px]'>
			<StyledView className='flex w-full h-full border border-green'>
                
            </StyledView>
		</StyledView>
	);
};