import React, { forwardRef } from 'react';
import { View, Text, TouchableHighlight, Pressable, Image } from 'react-native';
import { styled } from 'nativewind';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import Animated, {
	useAnimatedStyle,
	interpolate,
	Extrapolate
} from 'react-native-reanimated';
import { useStore } from '../app/global.js';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledImage = styled(Image);
const StyledIcon = styled(Ionicons);
const StyledAnimatedHighlight = styled(
	Animated.createAnimatedComponent(TouchableHighlight)
);

const FilterItem = forwardRef((props, ref) => {
	const updateFilter = useStore((state) => state.updateFilter);
	const updateFilterName = useStore((state) => state.updateFilterName);
	const itemStyle = useAnimatedStyle(() => {
		const inputRange = [
			(props.index - 3) * (props.itemSize + props.itemMargin),
			(props.index - 2.5) * (props.itemSize + props.itemMargin),
			(props.index - 2) * (props.itemSize + props.itemMargin),
			(props.index - 1.5) * (props.itemSize + props.itemMargin),
			(props.index - 1) * (props.itemSize + props.itemMargin),
			props.index * (props.itemSize + props.itemMargin),
			(props.index + 1) * (props.itemSize + props.itemMargin),
			(props.index + 1.5) * (props.itemSize + props.itemMargin),
			(props.index + 2) * (props.itemSize + props.itemMargin),
			(props.index + 2.5) * (props.itemSize + props.itemMargin),
			(props.index + 3) * (props.itemSize + props.itemMargin)
		];
		const shrinkOutputRange = [
			0.6, 0.6, 0.7, 0.8, 0.8, 1, 0.8, 0.8, 0.7, 0.6, 0.6
		];
		const fadeOutputRange = [
			0.6, 0.6, 0.6, 0.6, 0.6, 1, 0.6, 0.6, 0.6, 0.6, 0.6
		];
		const xOutputRange = [-70, -50, -30, -10, 0, 0, 0, 10, 30, 50, 70];
		const yOutputRange = [300, 150, 75, 50, 20, 0, 20, 50, 75, 150, 300];
		const translateX = interpolate(
			props.contentOffset.value,
			inputRange,
			xOutputRange,
			Extrapolate.CLAMP
		);
		const translateY = interpolate(
			props.contentOffset.value,
			inputRange,
			yOutputRange,
			Extrapolate.CLAMP
		);
		const shrink = interpolate(
			props.contentOffset.value,
			inputRange,
			shrinkOutputRange
		);
		const fade = interpolate(
			props.contentOffset.value,
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

	if (props.data.id == 'addCircles') {
		return (
			<StyledAnimatedHighlight
				style={[
					{
						borderColor: props.data.color,
						width: props.itemSize,
						height: props.itemSize,
						marginHorizontal: props.itemMargin / 2,
						top: 60
					},
					itemStyle
				]}
				className='justify-center'
			>
				<StyledPressable
					className='flex items-center justify-center'
					onPress={async () => {
						router.push('findCircles');
					}}
				>
					<StyledImage
						source={require('../assets/spiral/thin.png')}
						style={{ width: 80, height: 80 }}
					/>
					<StyledIcon
						name={'search-outline'}
						size={45}
						color={'#FFFBFC'}
						style={{ position: 'absolute' }}
					/>
				</StyledPressable>
			</StyledAnimatedHighlight>
		);
	} else if (props.data.id == 'Gridview') {
		return (
			<StyledAnimatedHighlight
				style={[
					{
						borderColor: props.data.color,
						width: props.itemSize,
						height: props.itemSize,
						marginHorizontal: props.itemMargin / 2,
						top: 60
					},
					itemStyle
				]}
				className='justify-center'
			>
				<StyledPressable
					className='flex items-center justify-center'
					onPress={() => {}}
				>
					<StyledImage
						source={require('../assets/spiral/thin.png')}
						style={{ width: 80, height: 80 }}
					/>
					<StyledIcon
						name={'apps-outline'}
						size={35}
						color={'#FFFBFC'}
						style={{ position: 'absolute' }}
					/>
				</StyledPressable>
			</StyledAnimatedHighlight>
		);
	} else {
		return (
			<StyledAnimatedHighlight
				style={[
					{
						borderColor: props.data.color,
						width: props.itemSize,
						height: props.itemSize,
						marginHorizontal: props.itemMargin / 2,
						top: 60
					},
					itemStyle
				]}
				className='flex border-[6px] items-center justify-center rounded-full'
				onPress={() => {
					props.toggleShown();
					updateFilter(props.data.id);
					updateFilterName(props.data.title);
				}}
			>
				<>
					<StyledText className='absolute text-white text-[20px] font-bold w-[150px] text-center bottom-20'>
						{props.data.title}
					</StyledText>
					<StyledIcon
						name={props.data.icon}
						size={35}
						color={props.data.iconColor || props.data.color}
					/>
				</>
			</StyledAnimatedHighlight>
		);
	}
});

export { FilterItem };
