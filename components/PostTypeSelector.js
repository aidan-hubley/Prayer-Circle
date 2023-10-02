import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { styled } from 'nativewind';
import {
	MaterialCommunityIcons,
	FontAwesome5,
	MaterialIcons
} from '@expo/vector-icons';

const StyledView = styled(View);
const StyledOpacity = styled(TouchableOpacity);
const StyledMaterialCommunityIcon = styled(MaterialCommunityIcons);
const StyledMaterialIcon = styled(MaterialIcons);
const StyledAnimatedView = styled(Animated.View);

function PostTypeSelector() {
	const [selected, setSelected] = useState(new Animated.Value(0));

	const selectedInter = selected.interpolate({
		inputRange: [0, 1, 2],
		outputRange: ['12.5%', '46%', '79.5%']
	});

	const handlePress = (index) => {
		Animated.spring(selected, {
			toValue: index,
			duration: 200,
			useNativeDriver: false
		}).start();
	};

	const highlightPosition = {
		left: selectedInter
	};

	return (
		<StyledView className='flex flex-row items-center justify-around h-[50px] w-full border border-offwhite rounded-full px-[15px] my-3'>
			<StyledAnimatedView
				style={highlightPosition}
				className='absolute flex items-center justify-center rounded-full bg-[#EBEBEB2c] w-[55px] h-[36px]'
			></StyledAnimatedView>
			<StyledOpacity
				className='flex items-center justify-center w-[50px] h-[50px]'
				onPress={() => handlePress(0)}
			>
				<StyledMaterialIcon
					name='celebration'
					size={26}
					color='white'
				/>
			</StyledOpacity>
			<StyledOpacity
				className='flex items-center justify-center w-[50px] h-[50px]'
				onPress={() => handlePress(1)}
			>
				<StyledMaterialCommunityIcon
					name='hands-pray'
					size={26}
					color='white'
				/>
			</StyledOpacity>
			<StyledOpacity
				className='flex items-center justify-center w-[50px] h-[50px]'
				onPress={() => handlePress(2)}
			>
				<StyledMaterialIcon name='event' size={27} color='white' />
			</StyledOpacity>
		</StyledView>
	);
}

export { PostTypeSelector };
