import React, {
	useState,
	forwardRef,
	useImperativeHandle,
	useRef
} from 'react';
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
import { MemberPermissionSelector } from './MemberPermissionSelector';

const StyledText = styled(Text);
const StyledView = styled(View);
const StyledImage = styled(Image);
const StyledTouchableHighlight = styled(TouchableHighlight);
const StyledIcon = styled(Ionicons);
// const AnimatedHighlight = styled(
// 	Animated.createAnimatedComponent(TouchableHighlight)
// );

function Member({ img, name, username, role, press, last }) {
	permissionRef = useRef(null);
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
			<StyledView className='absolute right-2'>
				<MemberPermissionSelector role={role} ref={permissionRef} />
			</StyledView>
		</StyledView>
	);
}

export { Member };
