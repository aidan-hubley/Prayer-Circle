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
			const shrinkOutputRange = [
				0.6, 0.6, 0.7, 0.8, 0.8, 1, 0.8, 0.8, 0.7, 0.6, 0.6
			];
			const fadeOutputRange = [
				0.6, 0.6, 0.6, 0.6, 0.6, 1, 0.6, 0.6, 0.6, 0.6, 0.6
			];
			const xOutputRange = [-70, -50, -30, -10, 0, 0, 0, 10, 30, 50, 70];
			const yOutputRange = [
				200, 110, 75, 50, 20, 0, 20, 50, 75, 110, 200
			];
			const translateX = interpolate(
				contentOffset.value,
				inputRange,
				xOutputRange,
				Extrapolate.CLAMP
			);
			const translateY = interpolate(
				contentOffset.value,
				inputRange,
				yOutputRange,
				Extrapolate.CLAMP
			);
			const shrink = interpolate(
				contentOffset.value,
				inputRange,
				shrinkOutputRange
			);
			const fade = interpolate(
				contentOffset.value,
				inputRange,
				fadeOutputRange
			);
			return {
				transform: [
					{
						translateX: translateX
					},
					{
						translateY: translateY
					},
					{
						scale: shrink
					}
				],
				opacity: fade
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
				<StyledIcon
					name={data.icon}
					size={35}
					color={data.iconColor || data.color}
				/>
			</StyledAnimatedHighlight>
		);
	}
);

export { FilterItem };
