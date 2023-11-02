import React, {
	useState,
	useRef,
	forwardRef,
	useImperativeHandle
} from 'react';
import { View, TouchableHighlight, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
	useAnimatedStyle,
	interpolate,
	Extrapolate
} from 'react-native-reanimated';

const StyledIcon = styled(Ionicons);
const StyledAnimatedHighlight = styled(
	Animated.createAnimatedComponent(TouchableHighlight)
);

const FilterItem = forwardRef(
	({ data, index, contentOffset, itemSize, itemMargin }, ref) => {
		const width = Dimensions.get('window').width;

		const itemStyle = useAnimatedStyle(() => {
			const inputRange = [
				(index - 3) * (itemSize + itemMargin),
				(index - 2.5) * (itemSize + itemMargin),
				(index - 2) * (itemSize + itemMargin),
				(index - 1.5) * (itemSize + itemMargin),
				(index - 1) * (itemSize + itemMargin),
				index * (itemSize + itemMargin),
				(index + 1) * (itemSize + itemMargin),
				(index + 1.5) * (itemSize + itemMargin),
				(index + 2) * (itemSize + itemMargin),
				(index + 2.5) * (itemSize + itemMargin),
				(index + 3) * (itemSize + itemMargin)
			];
			const outputRange = [180, 120, 75, 50, 15, 0, 15, 50, 75, 120, 180];
			const translateY = interpolate(
				contentOffset.value,
				inputRange,
				outputRange,
				Extrapolate.CLAMP
			);

			return {
				transform: [
					{
						translateY: translateY
					}
				]
			};
		});

		return (
			<StyledAnimatedHighlight
				style={[
					{
						borderColor: data.color,
						width: itemSize,
						height: itemSize,
						marginHorizontal: itemMargin / 2
					},
					itemStyle
				]}
				className='flex border-[6px] items-center justify-center rounded-full'
			>
				<StyledIcon name={data.icon} size={35} color={data.color} />
			</StyledAnimatedHighlight>
		);
	}
);

export { FilterItem };
