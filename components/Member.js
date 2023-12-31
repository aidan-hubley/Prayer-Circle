import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
	Text,
	View,
	Image,
	TouchableHighlight,
	Animated,
	Dimensions
} from 'react-native';
import { styled } from 'nativewind';
import { router } from '../backend/config';
import Ionicons from '@expo/vector-icons/Ionicons';

const StyledText = styled(Text);
const StyledView = styled(View);
const StyledImage = styled(Image);
const StyledTouchableHighlight = styled(TouchableHighlight);
const StyledIcon = styled(Ionicons);
// const AnimatedHighlight = styled(
// 	Animated.createAnimatedComponent(TouchableHighlight)
// );

function Member({ img, name, username, role, press, last }) {
	return (
		<StyledView
			style={{ width: Dimensions.get('window').width - 30 }}
			className={`h-[50px] flex flex-row justify-between items-center bg-grey px-[10px] py-[10px] border-x border-[#6666660d]
			${last ? 'rounded-b-[20px] h-[60px]' : ''}`}
		>
			<StyledView className='flex flex-row'>
				<StyledImage
					className='rounded-xl'
					style={{ width: 40, height: 40 }}
					source={{ uri: img }}
				/>
				<StyledView className='pl-2'>
					<StyledText
						className={`font-[600] text-offwhite text-[20px]`}
					>
						{name}
					</StyledText>
					<StyledText className={`text-offwhite text-[14px]`}>
						{username}
					</StyledText>
				</StyledView>
			</StyledView>
			<StyledView className='pr-2'>
				{role === 'own' ? (
					<StyledIcon
						name='key'
						size={35}
						color='#5946B2'
						className='rotate-45'
					/>
				) : role === 'mod' ? (
					<StyledIcon name='shield' size={30} color='#FFFBFC' />
				) : role === 'mem' ? (
					<StyledIcon
						name='checkmark-circle'
						size={30}
						color='#00A55E'
					/>
				) : role === 'sus' ? (
					<StyledIcon
						name='remove-circle'
						size={30}
						color='#F9A826'
					/>
				) : role === 'ban' ? (
					<StyledIcon name='close-circle' size={30} color='#CC2500' />
				) : null}
			</StyledView>
		</StyledView>
	);
}

export { Member };
